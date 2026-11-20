import { createHash } from 'node:crypto';

export function newsletterConfig(env = process.env) {
  const limit = Number(env.NEWSLETTER_HOURLY_LIMIT || 450);
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new Error('NEWSLETTER_HOURLY_LIMIT must be between 1 and 500');
  const user = (env.NEWSLETTER_SMTP_USER || 'noreply@putujemstravem.com').trim().toLowerCase();
  return {
    mode: env.NEWSLETTER_MODE === 'queue' ? 'queue' : 'legacy',
    // A production build locally is insufficient: explicit dispatch authorization is also required.
    production: env.NODE_ENV === 'production' && env.NEWSLETTER_PRODUCTION_ENABLED === 'true',
    worker: env.NEWSLETTER_WORKER_ENABLED === 'true',
    user, password: env.NEWSLETTER_SMTP_PASSWORD,
    host: 'mail.privateemail.com', port: 465,
    senderKey: createHash('sha256').update(`privateemail:${user}`).digest('hex'),
    limit, windowMs: 60 * 60 * 1000 + 60000,
    leaseMs: 5 * 60 * 1000,
    jwtSecret: env.JWT_SECRET,
  };
}

export function assertNewsletterProduction(config) {
  if (!config.production) {
    const error = new Error('Slanje newslettera isključeno je u ovom okruženju.');
    error.status = 503;
    throw error;
  }
}
