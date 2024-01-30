import { Router } from "express";
import controller from "../controllers/specificityController.js";

const router = new Router();

// POST /api/v1/specificities
router.post("/", controller.addSpecificities);

export default router;
