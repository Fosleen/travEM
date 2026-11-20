import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { verifyToken } from '../middleware/jwt_verify.js';
import { requireAdmin } from '../middleware/articleAccess.js';
import { getNewsletterQueue, assertNewsletterQueueWrite } from '../services/newsletterService.js';
import { newsletterConfig } from '../services/newsletter/config.js';

const router = Router();
router.use(verifyToken, requireAdmin);
router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
for (const name of ['articleId', 'campaignId']) {
  router.param(name, (req, res, next, value) => {
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) {
      return res.status(400).json({ error: 'Nevaljan identifikator.' });
    }
    next();
  });
}
const handler = (action) => async (req, res) => {
  try { await action(req, res); }
  catch (error) {
    console.error('Newsletter admin request failed:', error.message);
    res.status(error.status || 500).json({ error: error.status ? error.message : 'Pregled newslettera nije dostupan. Provjerite migraciju i konfiguraciju.' });
  }
};
router.get('/articles/:articleId', handler(async (req, res) => {
  const config = newsletterConfig();
  if (config.mode !== 'queue') return res.json({ enabled: false, canSend: false, campaigns: [] });
  res.json({ enabled: true, canSend: config.production, workerEnabled: config.worker && config.production,
    campaigns: await getNewsletterQueue().list(req.params.articleId) });
}));
router.post('/articles/:articleId', handler(async (req, res) => {
  const key = req.get('Idempotency-Key') ?? req.body?.request_key;
  if (key !== undefined && (typeof key !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(key))) {
    return res.status(400).json({ error: 'Nevaljan ključ zahtjeva.' });
  }
  const campaign = await assertNewsletterQueueWrite().enqueue(req.params.articleId,
    { key: `manual:${key || randomUUID()}` });
  res.status(202).json({ queued: true, campaignId: campaign.id });
}));
router.get('/articles/:articleId/campaigns/:campaignId/recipients', handler(async (req, res) => {
  res.json(await getNewsletterQueue().recipients(req.params.articleId, req.params.campaignId, req.query));
}));
router.post('/articles/:articleId/campaigns/:campaignId/retry', handler(async (req, res) => {
  res.json(await assertNewsletterQueueWrite().retry(req.params.articleId, req.params.campaignId));
}));
export default router;
