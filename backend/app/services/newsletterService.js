import db from '../models/index.js';
import { newsletterConfig, assertNewsletterProduction } from './newsletter/config.js';
import { createNewsletterQueue } from './newsletter/queue.js';
import { createNewsletterSmtp } from './newsletter/smtp.js';
import { notifyNewsletterWork } from './newsletter/workSignal.js';

let queue;
export function getNewsletterQueue() {
  const config = newsletterConfig();
  if (config.mode !== 'queue') throw Object.assign(new Error('Detaljna evidencija newslettera još nije uključena.'), { status: 503 });
  if (!queue) {
    const durableQueue = createNewsletterQueue({ sequelize: db.sequelize, models: db.models, config,
      send: createNewsletterSmtp(config) });
    queue = {
      ...durableQueue,
      async enqueue(...args) {
        const campaign = await durableQueue.enqueue(...args);
        // The transaction has committed before any SMTP work can begin.
        if (['queued', 'sending'].includes(campaign.status)) notifyNewsletterWork();
        return campaign;
      },
      async retry(...args) {
        const result = await durableQueue.retry(...args);
        if (result.retried) notifyNewsletterWork();
        return result;
      },
    };
  }
  return queue;
}
export function assertNewsletterQueueWrite() {
  const config = newsletterConfig();
  assertNewsletterProduction(config);
  if (!config.worker) throw Object.assign(new Error('Za pokretanje newslettera uključite worker na ovom backendu.'), { status: 503 });
  if (!config.password || !config.jwtSecret) {
    throw Object.assign(new Error('Nedostaje SMTP lozinka ili JWT_SECRET za newsletter.'), { status: 503 });
  }
  return getNewsletterQueue();
}
