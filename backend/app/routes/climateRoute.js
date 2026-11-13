import { Router } from 'express';
import { verifyToken } from '../middleware/jwt_verify.js';
import { requireAdmin } from '../middleware/articleAccess.js';
import { createMeteostatService } from '../services/meteostatService.js';

const router = Router();
const service = createMeteostatService();
router.use(verifyToken, requireAdmin);
const handle = work => async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try { res.json(await work(req)); }
  catch (error) { res.status(error.status || 503).json({ error: error.status ? error.message : 'Dohvat klimatskih podataka nije dostupan.' }); }
};
router.get('/status', handle(() => service.status()));
router.post('/preview', handle(req => service.preview(req.body)));
export default router;
