import { Router } from "express";
import controller from "../controllers/articleController.js";

const router = new Router();

// GET /api/v1/articles
router.get("/", controller.getArticles);

// GET /api/v1/articles/1
router.get("/:id", controller.getArticleById);

// POST /api/v1/articles
router.post("/", controller.addArticle);

export default router;
