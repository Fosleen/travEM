import { Router } from "express";
import specificityController from "../controllers/specificityController.js";

const router = new Router();

// POST /api/v1/specificities
router.post("/", specificityController.addSpecificities);

export default router;
