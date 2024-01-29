import { Router } from "express";
import visaInfoController from "../controllers/visaInfoController.js";

const router = new Router();

// POST /api/v1/visa-info
router.post("/", visaInfoController.addVisaInfo);

export default router;
