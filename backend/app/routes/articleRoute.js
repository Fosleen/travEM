import { Router } from "express";
import controller from "../controllers/articleController.js";

const router = new Router();

// GET /api/v1/articles?page=1&pageSize=12
router.get("/", controller.getArticles);

// GET /api/v1/articles/homepage
router.get("/homepage", controller.getHomepageArticles);

// GET /api/v1/articles/country/top/1
router.get("/country/top/:id", controller.getTopCountryArticle);

// GET /api/v1/articles/country/1
router.get("/country/:id", controller.getArticlesByCountryId);

// GET /api/v1/articles/place/1
router.get("/place/:id", controller.getArticlesByPlaceId);

// GET /api/v1/articles/1
router.get("/:id", controller.getArticleById);

// POST /api/v1/articles
router.post("/", controller.addArticle);

// PATCH /api/v1/articles/4
router.patch("/:id", controller.patchArticle);

// PUT /api/v1/articles/country/top
router.put("/country/top", controller.updateOrCreateTopCountryArticle);

// PUT /api/v1/articles/homepage/1
router.put(
  "/homepage/:specialTypeId",
  controller.updateOrCreateTopHomepageArticles // update articles on any homepage part
);

export default router;
