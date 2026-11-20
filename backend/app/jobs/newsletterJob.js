import { newsletterConfig } from '../services/newsletter/config.js';
import { getNewsletterQueue } from '../services/newsletterService.js';
import { createNewsletterWorker } from '../services/newsletter/worker.js';
import { onNewsletterWork } from '../services/newsletter/workSignal.js';

let worker;

export function startNewsletterJob() {
  const config = newsletterConfig();
  if (config.mode !== 'queue' || !config.production || !config.worker) return;
  if (!worker) {
    worker = createNewsletterWorker({ queue: getNewsletterQueue(), subscribe: onNewsletterWork });
    worker.start();
  }
  return worker;
}
