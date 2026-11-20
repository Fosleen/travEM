import { Op } from 'sequelize';
import { randomUUID } from 'node:crypto';

const activeStatuses = ['queued', 'sending'];
const deliveryStatuses = ['pending', 'sending', 'sent', 'failed', 'uncertain', 'skipped'];
const recipientAttributes = ['id', 'email', 'status', 'attempts', 'next_attempt_at', 'last_attempt_at', 'sent_at', 'last_error'];
const errorWithStatus = (message, status) => Object.assign(new Error(message), { status });
const shortError = (error) => `${error.code || 'SMTP'} ${error.responseCode || ''}: ${error.message || 'Slanje nije uspjelo'}`.slice(0, 2000);

export function createNewsletterQueue({ sequelize, models, config, send, now = () => new Date() }) {
  const { NewsletterCampaign: Campaign, NewsletterDelivery: Delivery,
    NewsletterSender: Sender, NewsletterAttempt: Attempt, Article, ArticleReview,
    ArticleSchedule, Subscriber } = models;
  let senderReady;

  async function ensureSender() {
    senderReady ||= Sender.findOrCreate({ where: { sender_key: config.senderKey } }).catch((error) => {
      senderReady = null;
      throw error;
    });
    await senderReady;
  }

  async function enqueue(articleId, { source = 'manual', key, scheduleId = null } = {}) {
    if (typeof key !== 'string' || !key.trim() || key.length > 180) throw errorWithStatus('Nedostaje valjan ključ zahtjeva.', 400);
    // Serializes campaigns for the same article, including concurrent HTTP/job requests.
    return sequelize.transaction(async (transaction) => {
      const article = await Article.findByPk(articleId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!article || article.is_deal_draft) throw errorWithStatus('Članak nije objavljen.', 400);
      const review = await ArticleReview.findByPk(articleId, { transaction });
      const schedule = await ArticleSchedule.findOne({ where: { articleId }, transaction });
      if ((review && review.status !== 'approved') || (schedule?.publish_at && new Date(schedule.publish_at) > now())) {
        throw errorWithStatus('Newsletter je dopušten samo za odobren i objavljen članak.', 400);
      }
      const existing = await Campaign.findOne({ where: source === 'scheduled'
        ? { [Op.or]: [{ dedupe_key: key }, { schedule_key: key }] }
        : { dedupe_key: key }, transaction });
      if (existing) {
        if (existing.article_id !== Number(articleId)) throw errorWithStatus('Ključ zahtjeva pripada drugom članku.', 409);
        return existing;
      }
      const active = await Campaign.findOne({ where: { article_id: articleId, status: { [Op.in]: activeStatuses } }, transaction });
      if (active) {
        if (source === 'scheduled' && (!active.schedule_key || active.schedule_key === key)) {
          // A manual send may have started just before the publication job ran.
          // Associate it rather than sending the same article twice.
          await active.update({ schedule_id: scheduleId, schedule_key: key }, { transaction });
          return active;
        }
        throw errorWithStatus(`Newsletter #${active.id} za ovaj članak već je u redu slanja.`, 409);
      }
      // Snapshot canonical DB content, never client-supplied HTML/recipient lists.
      const snapshot = {
        id: article.id, slug: article.slug, article_title: article.title,
        article_subtitle: article.subtitle, article_description: article.description,
        mainArticleImage: article.main_image_url, article_type_id: article.articleTypeId,
      };
      const subscribers = await Subscriber.findAll({ attributes: ['id', 'email'], order: [['id', 'ASC']], transaction });
      let scheduleKey = source === 'scheduled' ? key : null;
      if (source === 'manual' && schedule?.notify_subscribers_on_publish && schedule.publish_at && !schedule.newsletter_sent_at) {
        const publicationKey = scheduledNewsletterKey(article.id, schedule.publish_at);
        const alreadyTracked = await Campaign.findOne({ where: { schedule_key: publicationKey }, transaction });
        if (!alreadyTracked) { scheduleKey = publicationKey; scheduleId = schedule.id; }
      }
      const campaign = await Campaign.create({ article_id: article.id, dedupe_key: key,
        sender_key: config.senderKey, article_snapshot: JSON.stringify(snapshot), source,
        schedule_id: scheduleId, schedule_key: scheduleKey,
        status: subscribers.length ? 'queued' : 'completed',
        created_at: now(), completed_at: subscribers.length ? null : now(),
      }, { transaction });
      const seen = new Set();
      const deliveries = subscribers.filter((subscriber) => {
        const email = subscriber.email.trim().toLowerCase();
        if (seen.has(email)) return false;
        seen.add(email); return true;
      }).map((subscriber) => ({ campaign_id: campaign.id, subscriber_id: subscriber.id,
        email: subscriber.email.trim().toLowerCase(), status: 'pending', attempts: 0,
        next_attempt_at: now(),
      }));
      if (deliveries.length) await Delivery.bulkCreate(deliveries, { transaction });
      return campaign;
    });
  }

  async function refreshCampaign(campaignId, transaction) {
    const campaign = await Campaign.findByPk(campaignId, { transaction });
    const counts = await Delivery.findAll({ where: { campaign_id: campaignId }, attributes: ['status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']], group: ['status'], raw: true, transaction });
    const byStatus = Object.fromEntries(counts.map((row) => [row.status, Number(row.count)]));
    const unfinished = (byStatus.pending || 0) + (byStatus.sending || 0);
    const failures = (byStatus.failed || 0) + (byStatus.uncertain || 0);
    await campaign.update({ status: unfinished ? 'sending' : failures ? 'completed_with_errors' : 'completed',
      completed_at: unfinished ? null : now(),
    }, { transaction });
    if (!unfinished && campaign.schedule_id) {
      // Only complete the schedule that created this campaign, if it was not rescheduled.
      const schedule = await ArticleSchedule.findByPk(campaign.schedule_id, { transaction });
      const expectedKey = schedule?.publish_at && scheduledNewsletterKey(campaign.article_id, schedule.publish_at);
      if (expectedKey === (campaign.schedule_key || campaign.dedupe_key)) await schedule.update({
        newsletter_sent_at: failures ? null : now(),
        newsletter_send_error: failures ? `Newsletter #${campaign.id}: ${failures} neuspjelih ili neizvjesnih slanja.` : null,
      }, { transaction });
    }
  }

  async function claim() {
    // findOrCreate outside the claim transaction handles first-use races on MySQL.
    await ensureSender();
    return sequelize.transaction(async (transaction) => {
      const sender = await Sender.findByPk(config.senderKey, { transaction, lock: transaction.LOCK.UPDATE });
      const instant = now();
      if (sender.lease_until && new Date(sender.lease_until) > instant) return null;
      // An expired send may already have reached SMTP. Never automatically replay it.
      const stale = await Attempt.findAll({ where: { sender_key: config.senderKey, status: 'sending' }, transaction });
      for (const attempt of stale) {
        await attempt.update({ status: 'uncertain', finished_at: instant, error: 'Worker prekinut tijekom SMTP slanja.' }, { transaction });
        await Delivery.update({ status: 'uncertain', last_error: 'Ishod SMTP slanja nije potvrđen nakon prekida. Provjerite prije ponavljanja.' },
          { where: { id: attempt.delivery_id, status: 'sending' }, transaction });
        const delivery = await Delivery.findByPk(attempt.delivery_id, { transaction });
        await refreshCampaign(delivery.campaign_id, transaction);
      }
      if (sender.blocked_until && new Date(sender.blocked_until) > instant) return null;
      const quotaWhere = { sender_key: config.senderKey,
        started_at: { [Op.gt]: new Date(instant.getTime() - config.windowMs) } };
      const recentCount = await Attempt.count({ where: quotaWhere, transaction });
      if (recentCount >= config.limit) {
        // If the configured limit was reduced, wait until enough reservations expire.
        const boundary = await Attempt.findOne({ where: quotaWhere, attributes: ['started_at'],
          order: [['started_at', 'ASC'], ['id', 'ASC']], offset: recentCount - config.limit, transaction });
        await sender.update({ blocked_until: new Date(new Date(boundary.started_at).getTime() + config.windowMs + 1000),
          last_error: 'Čeka se slobodna satna kvota mailboxa.' }, { transaction });
        return null;
      }
      const campaigns = await Campaign.findAll({ where: { sender_key: config.senderKey,
        status: { [Op.in]: activeStatuses } }, attributes: ['id'], transaction });
      if (!campaigns.length) return null;
      const delivery = await Delivery.findOne({ where: { campaign_id: { [Op.in]: campaigns.map((c) => c.id) },
        status: 'pending', next_attempt_at: { [Op.lte]: instant } }, order: [['id', 'ASC']], transaction,
        lock: transaction.LOCK.UPDATE });
      if (!delivery) return null;
      const subscriber = await Subscriber.findByPk(delivery.subscriber_id, { transaction });
      const campaign = await Campaign.findByPk(delivery.campaign_id, { transaction });
      const article = await Article.findByPk(campaign.article_id, { transaction });
      const review = article && await ArticleReview.findByPk(article.id, { transaction });
      const schedule = article && await ArticleSchedule.findOne({ where: { articleId: article.id }, transaction });
      const unpublished = !article || article.is_deal_draft || (review && review.status !== 'approved') ||
        (schedule?.publish_at && new Date(schedule.publish_at) > instant);
      if (!subscriber || subscriber.email.trim().toLowerCase() !== delivery.email || unpublished) {
        await delivery.update({ status: 'skipped', last_error: unpublished ? 'Članak više nije objavljen ili odobren.' : 'Pretplatnik se odjavio ili je adresa promijenjena.' }, { transaction });
        await refreshCampaign(delivery.campaign_id, transaction);
        return { skipped: true };
      }
      const token = randomUUID();
      await sender.update({ lease_token: token, lease_until: new Date(instant.getTime() + config.leaseMs),
        blocked_until: null, last_error: null }, { transaction });
      await delivery.update({ status: 'sending', attempts: delivery.attempts + 1,
        retry_count: delivery.retry_count + 1, last_attempt_at: instant }, { transaction });
      if (campaign.status !== 'sending') await campaign.update({ status: 'sending' }, { transaction });
      const attempt = await Attempt.create({ delivery_id: delivery.id, sender_key: config.senderKey,
        started_at: instant, status: 'sending' }, { transaction });
      return { delivery, campaign, attempt, token };
    });
  }

  async function hasWork() {
    return Boolean(await Campaign.findOne({ where: { sender_key: config.senderKey,
      status: { [Op.in]: activeStatuses } }, attributes: ['id'] }));
  }

  async function dispatchOne() {
    // The worker checks campaign availability once per cycle, not once per recipient.
    const claimed = await claim();
    if (!claimed || claimed.skipped) return Boolean(claimed);
    const { delivery, campaign, attempt, token } = claimed;
    let info; let failure;
    try { info = await send(delivery.email, JSON.parse(campaign.article_snapshot)); }
    catch (error) { failure = error; }
    // Never catch DB completion errors as SMTP errors: lease recovery marks them uncertain.
    await sequelize.transaction(async (transaction) => {
      const sender = await Sender.findByPk(config.senderKey, { transaction, lock: transaction.LOCK.UPDATE });
      if (sender.lease_token !== token) return;
      let status = 'sent'; let nextAttempt = now(); let blockedUntil = null;
      const errorText = failure ? shortError(failure) : null;
      if (failure) {
        const dailyQuota = /daily.*(?:limit|quota)|(?:limit|quota).*daily/i.test(errorText);
        const hourlyQuota = /(?:hour|sending|rate).*(?:limit|quota)|(?:limit|quota).*exceed/i.test(errorText);
        const authentication = failure.code === 'EAUTH';
        // Only explicit SMTP rejections or failures before SMTP DATA can be retried safely.
        const explicitRejection = Number(failure.responseCode) >= 400;
        const beforeDelivery = authentication || ['CONN', 'EHLO', 'HELO', 'STARTTLS'].includes(failure.command);
        const temporary = Number(failure.responseCode) >= 400 && Number(failure.responseCode) < 500;
        if (dailyQuota || hourlyQuota || authentication) {
          blockedUntil = new Date(now().getTime() + (dailyQuota ? 25 * 3600000 : 65 * 60000));
          nextAttempt = blockedUntil;
          status = delivery.retry_count < 3 ? 'pending' : 'failed';
        } else if ((temporary || beforeDelivery) && delivery.retry_count < 3) {
          status = 'pending'; nextAttempt = new Date(now().getTime() + delivery.retry_count * 5 * 60000);
        } else status = explicitRejection || beforeDelivery ? 'failed' : 'uncertain';
      }
      await attempt.update({ status: failure ? status === 'uncertain' ? 'uncertain' : 'failed' : 'sent',
        finished_at: now(), error: errorText }, { transaction });
      await delivery.update({ status, next_attempt_at: nextAttempt, last_error: errorText,
        sent_at: failure ? null : now(), message_id: info?.messageId?.slice(0, 255) || null }, { transaction });
      await sender.update({ lease_token: null, lease_until: null, blocked_until: blockedUntil,
        last_error: errorText }, { transaction });
      await refreshCampaign(campaign.id, transaction);
    });
    return true;
  }

  async function list(articleId) {
    const campaigns = await Campaign.findAll({ where: { article_id: articleId }, order: [['id', 'DESC']],
      attributes: ['id', 'source', 'status', 'sender_key', 'created_at', 'completed_at'] });
    if (!campaigns.length) return [];
    const [grouped, senders] = await Promise.all([
      Delivery.findAll({ where: { campaign_id: { [Op.in]: campaigns.map((campaign) => campaign.id) } },
        attributes: ['campaign_id', 'status', [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('MIN', sequelize.col('next_attempt_at')), 'next_attempt_at']],
        group: ['campaign_id', 'status'], raw: true }),
      Sender.findAll({ where: { sender_key: { [Op.in]: [...new Set(campaigns.map((campaign) => campaign.sender_key))] } },
        attributes: ['sender_key', 'blocked_until'], raw: true }),
    ]);
    const statistics = new Map();
    for (const row of grouped) {
      const stats = statistics.get(row.campaign_id) || { counts: {}, total: 0, pendingAt: null };
      stats.counts[row.status] = Number(row.count);
      stats.total += Number(row.count);
      if (row.status === 'pending') stats.pendingAt = new Date(row.next_attempt_at);
      statistics.set(row.campaign_id, stats);
    }
    const blocks = new Map(senders.map((sender) => [sender.sender_key, sender.blocked_until ? new Date(sender.blocked_until).getTime() : 0]));
    return campaigns.map((campaign) => {
      const stats = statistics.get(campaign.id) || { counts: {}, total: 0, pendingAt: null };
      return { id: campaign.id, source: campaign.source, status: campaign.status,
        created_at: campaign.created_at, completed_at: campaign.completed_at,
        counts: stats.counts, total: stats.total,
        next_attempt_at: stats.pendingAt ? new Date(Math.max(stats.pendingAt.getTime(), blocks.get(campaign.sender_key) || 0)) : null,
      };
    });
  }

  async function recipients(articleId, campaignId, { page = 1, status = '', search = '' } = {}) {
    if (typeof search !== 'string' || typeof status !== 'string' || !Number.isFinite(Number(page))) {
      throw errorWithStatus('Nevaljani uvjeti pretraživanja.', 400);
    }
    const campaign = await Campaign.findOne({ where: { id: campaignId, article_id: articleId } });
    if (!campaign) throw errorWithStatus('Kampanja nije pronađena.', 404);
    if (status && !deliveryStatuses.includes(status)) throw errorWithStatus('Nepoznat status.', 400);
    const where = { campaign_id: campaignId,
      ...(status ? { status } : {}), ...(search ? { email: { [Op.like]: `%${search.slice(0, 200)}%` } } : {}) };
    const currentPage = Math.max(1, Math.floor(Number(page) || 1));
    if (!Number.isSafeInteger(currentPage) || !Number.isSafeInteger((currentPage - 1) * 25)) {
      throw errorWithStatus('Nevaljana stranica.', 400);
    }
    const result = await Delivery.findAndCountAll({ where, attributes: recipientAttributes,
      limit: 25, offset: (currentPage - 1) * 25, order: [['id', 'ASC']] });
    return { data: result.rows, total: result.count, page: currentPage, pageSize: 25 };
  }

  async function retry(articleId, campaignId) {
    await ensureSender();
    return sequelize.transaction(async (transaction) => {
      // Serialize recipient resets with worker completion and quota claims.
      await Sender.findByPk(config.senderKey, { transaction, lock: transaction.LOCK.UPDATE });
      // Same lock order as enqueue prevents racing a new campaign and retry.
      await Article.findByPk(articleId, { transaction, lock: transaction.LOCK.UPDATE });
      const campaign = await Campaign.findOne({ where: { id: campaignId, article_id: articleId }, transaction });
      if (!campaign || campaign.sender_key !== config.senderKey) throw errorWithStatus('Kampanja nije dostupna za ovaj mailbox.', 404);
      const another = await Campaign.findOne({ where: { article_id: articleId,
        id: { [Op.ne]: campaign.id }, status: { [Op.in]: activeStatuses } }, transaction });
      if (another) throw errorWithStatus('Druga kampanja za ovaj članak već se šalje.', 409);
      const [count] = await Delivery.update({ status: 'pending', retry_count: 0, next_attempt_at: now(), last_error: null },
        { where: { campaign_id: campaign.id, status: 'failed' }, transaction });
      // Sent/uncertain/skipped messages are intentionally never replayed by this action.
      if (count) await campaign.update({ status: 'queued', completed_at: null }, { transaction });
      return { retried: count };
    });
  }

  return { enqueue, dispatchOne, hasWork, list, recipients, retry };
}

export const scheduledNewsletterKey = (articleId, publishAt) =>
  `schedule:${articleId}:${new Date(publishAt).toISOString()}`;
