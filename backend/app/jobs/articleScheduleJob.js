import db from "../models/index.js";
import { isArticlePublicationTime } from "../utils/articlePublicationHours.js";
import { Op } from "sequelize";
import {
  clearCache,
  clearCacheByPattern,
} from "../middleware/redis.js";
import subscriberService from "../services/subscriberService.js";
import { newsletterConfig } from '../services/newsletter/config.js';
import { assertNewsletterQueueWrite } from '../services/newsletterService.js';
import { scheduledNewsletterKey } from '../services/newsletter/queue.js';

const DEFAULT_INTERVAL_MS = 10 * 60 * 1000;

const mapArticleForNewsletter = (article) => ({
  id: article.id,
  article_title: article.title,
  article_subtitle: article.subtitle,
  article_description: article.description,
  mainArticleImage: article.main_image_url,
  article_type_id: article.articleTypeId,
});

const clearPublishedArticleCaches = async (article) => {
  await Promise.all([
    clearCache(`article:${article.id}`),
    clearCache(`article:${article.id}:admin`),
    clearCache("homepage-articles"),
    clearCache("homepage-articles:admin"),
    clearCache("homepage-stats"),
    article.countryId
      ? clearCache(`country:${article.countryId}`)
      : Promise.resolve(),
    article.countryId
      ? clearCache(`top-country-article:${article.countryId}`)
      : Promise.resolve(),
    clearCacheByPattern("countries-page:*"),
    clearCacheByPattern("country-name:*"),
    clearCacheByPattern("continent-countries:*"),
  ]);
};

const processSchedule = async (schedule) => {
  const article = schedule.article;

  if (!article) {
    await schedule.update({
      publish_process_error: "Article not found for schedule.",
    });
    return;
  }
  if (article.is_deal_draft) return;
  const review = await db.models.ArticleReview.findByPk(article.id);
  if (review && review.status !== "approved") return;

  await clearPublishedArticleCaches(article);

  const newsletter = newsletterConfig();
  const shouldSendNewsletter =
    schedule.notify_subscribers_on_publish && !schedule.newsletter_sent_at && newsletter.production;

  if (shouldSendNewsletter && newsletter.mode === 'queue') {
    try {
      const campaign = await assertNewsletterQueueWrite().enqueue(article.id, {
        key: scheduledNewsletterKey(article.id, schedule.publish_at),
        source: 'scheduled', scheduleId: schedule.id,
      });
      await schedule.update({ newsletter_send_started_at: new Date(),
        // The worker wakes immediately; do not overwrite a result it may have
        // already persisted while this publication job was still finishing.
        ...(campaign.status === 'completed'
          ? { newsletter_sent_at: new Date(), newsletter_send_error: null } : {}) });
    } catch (error) {
      // Keep the unstarted marker so the scheduler can retry an enqueue failure.
      await schedule.update({ newsletter_send_error: error.message });
    }
  } else if (shouldSendNewsletter) {
    await schedule.update({
      newsletter_send_started_at: new Date(),
      newsletter_send_error: null,
    });

    try {
      const subscribers = await db.models.Subscriber.findAll({});

      if (subscribers.length > 0) {
        await subscriberService.sendNewsletter(
          subscribers,
          mapArticleForNewsletter(article)
        );
      }

      await schedule.update({
        newsletter_sent_at: new Date(),
        newsletter_send_error: null,
      });
    } catch (error) {
      await schedule.update({
        newsletter_send_error: error.message,
      });
    }
  }

  await schedule.update({
    publish_processed_at: new Date(),
    publish_process_error: null,
  });
};

export const processDueArticleSchedules = async () => {
  if (!isArticlePublicationTime()) return;
  const dueSchedules = await db.models.ArticleSchedule.findAll({
    where: {
      publish_at: {
        [Op.ne]: null,
        [Op.lte]: new Date(),
      },
      [Op.or]: [
        { publish_processed_at: null },
        {
          notify_subscribers_on_publish: true,
          newsletter_sent_at: null,
          newsletter_send_started_at: null,
        },
      ],
    },
    include: [
      {
        model: db.models.Article,
      },
    ],
    limit: 10,
    order: [["publish_at", "ASC"]],
  });

  for (const schedule of dueSchedules) {
    await processSchedule(schedule);
  }
};

export const startArticleScheduleJob = () => {
  if (process.env.ARTICLE_SCHEDULE_JOB_ENABLED === 'false') return;
  const intervalMs = Number(
    process.env.ARTICLE_SCHEDULE_JOB_INTERVAL_MS || DEFAULT_INTERVAL_MS
  );

  const tick = async () => {
    try {
      await processDueArticleSchedules();
    } catch (error) {
      console.error("Article schedule job failed:", error);
    } finally {
      let next = new Date(Date.now() + intervalMs);
      // Advance using real instants so DST changes follow Europe/Zagreb.
      while (!isArticlePublicationTime(next)) {
        next = new Date(next.getTime() + 60 * 1000);
        next.setUTCSeconds(0, 0);
      }
      setTimeout(tick, next.getTime() - Date.now());
    }
  };
  void tick();
};
