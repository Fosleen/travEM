import { Router } from "express";
import controller from "../controllers/homepageController.js";

const router = new Router();

// GET /api/v1/homepage
router.get("/", controller.getHomepage);

// GET /api/v1/homepage/stats
router.get("/stats", controller.getHomepageStats);

// PATCH /api/v1/homepage
router.patch("/", controller.patchHomepage);

export default router;
