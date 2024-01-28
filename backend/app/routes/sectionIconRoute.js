import { Router } from "express";
import controller from "../controllers/sectionIconController.js";

const router = new Router();

// GET /api/v1/section-icons
router.get("/", controller.getSectionIcons);

export default router;
