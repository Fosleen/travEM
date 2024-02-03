import { Router } from "express";
import controller from "../controllers/colorController.js";

const router = new Router();

// GET /api/v1/colors
router.get("/", controller.getColors);

export default router;
