import { Router } from "express";
import controller from "../controllers/articleTypeController.js";

const router = new Router();

// GET /api/v1/article-types
router.get("/", controller.getArticleTypes);

export default router;
