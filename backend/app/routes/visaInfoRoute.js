import { Router } from "express";
import controller from "../controllers/visaInfoController.js";

const router = new Router();

// POST /api/v1/visa-info
router.post("/", controller.addVisaInfo);

export default router;
