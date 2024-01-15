import { Router } from "express";
import controller from "../controllers/articleController.js";

const router = new Router();

// GET /api/v1/articles
router.get("/", controller.getArticles);

// GET /api/v1/articles/homepage
router.get("/homepage", controller.getHomepageArticles);

// GET /api/v1/articles/country/top/1
router.get("/country/top/:id", controller.getTopCountryArticle);

// GET /api/v1/articles/country/1
router.get("/country/:id", controller.getArticlesByCountryId);

// GET /api/v1/articles/1
router.get("/:id", controller.getArticleById);

// POST /api/v1/articles
router.post("/", controller.addArticle);

// PUT /api/v1/articles/country/top
router.put("/country/top", controller.updateOrCreateTopCountryArticle);

export default router;
