import service from "../services/articleService.js";

class ArticleController {
  async getArticles(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    const articleType = parseInt(req.query.articleType) || null;

    const response = await service.getArticles(page, pageSize, articleType);

    if (response.articles.length === 0) {
      res.status(404).json({ error: "No articles found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getArticleById(req, res) {
    const { id } = req.params;
    const response = await service.getArticleById(id);
    if (response.length == 0) {
      res.status(404).json({ error: `No article found by id ${id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async addArticle(req, res) {
    const response = await service.addArticle(
      req.body.title,
      req.body.subtitle,
      req.body.description,
      req.body.main_image_url,
      req.body.date_written,
      req.body.user_id,
      req.body.article_type_id,
      req.body.country_id,
      req.body.place_id
    );

    if (response == undefined) {
      res.status(500).json({ error: "Error inserting article" });
    } else {
      res.status(200).json(response);
    }
  }

  async getHomepageArticles(req, res) {
    const response = await service.getHomepageArticles();
    if (response.length == 0) {
      res.status(404).json({ error: "No articles for homepage found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getTopCountryArticle(req, res) {
    const { id } = req.params;
    const response = await service.getTopCountryArticle(id);
    if (response.length == 0) {
      res
        .status(404)
        .json({ error: `No top articles for country with id ${id} found` });
    } else {
      res.status(200).json(response);
    }
  }

  async getArticlesByCountryId(req, res) {
    const { id } = req.params;
    const response = await service.getArticlesByCountryId(id);
    if (response.length == 0) {
      res
        .status(404)
        .json({ error: `No articles for country with id ${id} found` });
    } else {
      res.status(200).json(response);
    }
  }

  async getArticlesByPlaceId(req, res) {
    const { id } = req.params;
    const response = await service.getArticlesByPlaceId(id);
    if (response.length == 0) {
      res
        .status(404)
        .json({ error: `No articles for place with id ${id} found` });
    } else {
      res.status(200).json(response);
    }
  }

  async updateOrCreateTopCountryArticle(req, res) {
    const response = await service.updateOrCreateTopCountryArticle(
      req.body.article_id
    );

    if (response.length == 0) {
      res.status(404).json({ error: `No articles found` });
    } else {
      res.status(200).json(response);
    }
  }

  async updateOrCreateTopHomepageArticles(req, res) {
    const response = await service.updateOrCreateTopHomepageArticles(
      req.body.article_id,
      req.params.specialTypeId
    );

    if (response.length == 0) {
      res.status(500).json({ error: `No articles updated` });
    } else {
      res.status(200).json(response);
    }
  }

  async patchArticle(req, res) {
    const response = await service.patchArticle(
      req.params.id,
      req.body.title,
      req.body.subtitle,
      req.body.description,
      req.body.main_image_url,
      req.body.date_written,
      req.body.article_type_id,
      req.body.user_id,
      req.body.country_id,
      req.body.place_id
    );
    if (response.length == 0) {
      res.status(500).json({ error: `Error updating article ${id}` });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new ArticleController();
