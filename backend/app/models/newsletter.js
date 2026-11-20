// No associations with existing tables: legacy deployments can ignore these tables.
export function defineNewsletterModels(sequelize, D) {
  const options = { timestamps: false, freezeTableName: true };
  const id = () => ({ type: D.INTEGER, primaryKey: true, autoIncrement: true });
  const NewsletterCampaign = sequelize.define('newsletter_campaign', {
    id: id(), article_id: { type: D.INTEGER, allowNull: false },
    dedupe_key: { type: D.STRING(191), allowNull: false, unique: true },
    sender_key: { type: D.STRING(64), allowNull: false },
    article_snapshot: { type: D.TEXT, allowNull: false },
    source: { type: D.STRING(20), allowNull: false },
    schedule_id: D.INTEGER,
    schedule_key: { type: D.STRING(191), unique: true },
    status: { type: D.STRING(30), allowNull: false, defaultValue: 'queued' },
    created_at: { type: D.DATE, allowNull: false }, completed_at: D.DATE,
  }, options);
  const NewsletterDelivery = sequelize.define('newsletter_delivery', {
    id: id(), campaign_id: { type: D.INTEGER, allowNull: false },
    subscriber_id: { type: D.INTEGER, allowNull: false },
    email: { type: D.STRING(200), allowNull: false },
    status: { type: D.STRING(30), allowNull: false, defaultValue: 'pending' },
    attempts: { type: D.INTEGER, allowNull: false, defaultValue: 0 },
    retry_count: { type: D.INTEGER, allowNull: false, defaultValue: 0 },
    next_attempt_at: { type: D.DATE, allowNull: false },
    last_attempt_at: D.DATE, sent_at: D.DATE, last_error: D.TEXT,
    message_id: D.STRING(255),
  }, { ...options, indexes: [
    { unique: true, fields: ['campaign_id', 'email'] },
    { fields: ['status', 'next_attempt_at'] },
  ] });
  const NewsletterSender = sequelize.define('newsletter_sender', {
    sender_key: { type: D.STRING(64), primaryKey: true },
    lease_token: D.STRING(36), lease_until: D.DATE,
    blocked_until: D.DATE, last_error: D.TEXT,
  }, options);
  const NewsletterAttempt = sequelize.define('newsletter_attempt', {
    id: id(), delivery_id: { type: D.INTEGER, allowNull: false },
    sender_key: { type: D.STRING(64), allowNull: false },
    started_at: { type: D.DATE, allowNull: false }, finished_at: D.DATE,
    status: { type: D.STRING(30), allowNull: false }, error: D.TEXT,
  }, { ...options, indexes: [{ fields: ['sender_key', 'started_at'] }] });
  return { NewsletterCampaign, NewsletterDelivery, NewsletterSender, NewsletterAttempt };
}
