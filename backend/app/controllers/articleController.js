import articleService from "../services/articleService.js";
import videoService from "../services/videoService.js";

class ArticleController {
  async getArticles(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    const articleType = parseInt(req.query.articleType) || null;

    const response = await articleService.getArticles(
      page,
      pageSize,
      articleType
    );

    if (response.data.length === 0) {
      res.status(404).json([{ error: "No articles found" }]);
    } else {
      res.status(200).json(response);
    }
  }

  async getArticleByName(req, res) {
    const { name } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 200;

    const response = await articleService.getArticleByName(
      name,
      page,
      pageSize
    );
    if (!response || response.length == 0) {
      res.status(404).json({ error: `No article found by name ${name}` });
    } else {
      res.status(200).json(response);
    }
  }

  async getArticleById(req, res) {
    const { id } = req.params;
    const response = await articleService.getArticleById(id);
    if (!response || response.length == 0) {
      res.status(404).json({ error: `No article found by id ${id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async addArticle(req, res) {
    const response = await articleService.addArticle(
      req.body.title,
      req.body.subtitle,
      req.body.description,
      req.body.main_image_url,
      req.body.date_written,
      req.body.user_id,
      req.body.article_type_id,
      req.body.country_id,
      req.body.place_id,
      req.body.airport_city_id
    );

    console.log(response.toJSON());

    let response2;
    if (req.body.video) {
      response2 = await videoService.addVideo(
        req.body.video,
        response.toJSON().id,
        null,
        null
      );
    } else {
      response2 = null;
    }

    if (response === undefined || response2 === undefined) {
      res.status(500).json({ error: "Error inserting article" });
    } else {
      res.status(200).json(response);
    }
  }

  async getHomepageArticles(req, res) {
    const response = await articleService.getHomepageArticles();
    if (response.length == 0) {
      res.status(404).json({ error: "No articles for homepage found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getTopCountryArticle(req, res) {
    const { id } = req.params;
    const response = await articleService.getTopCountryArticle(id);
    if (!response || response.length == 0) {
      res.status(200).json({ error: "no top article found for country" });
    } else {
      res.status(200).json(response);
    }
  }

  async getArticlesByCountryId(req, res) {
    const { id } = req.params;
    const response = await articleService.getArticlesByCountryId(id);
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
    const response = await articleService.getArticlesByPlaceId(id);
    if (response.length == 0) {
      res
        .status(404)
        .json({ error: `No articles for place with id ${id} found` });
    } else {
      res.status(200).json(response);
    }
  }

  async getRecommendedArticles(req, res) {
    const { id } = req.params;
    const { type } = req.query;
    const response = await articleService.getRecommendedArticles(id, type);
    if (response.length == 0) {
      res.status(404).json({ error: `No recommended articles found` });
    } else {
      res.status(200).json(response);
    }
  }

  async updateOrCreateTopCountryArticle(req, res) {
    const response = await articleService.updateOrCreateTopCountryArticle(
      req.body.article_id
    );

    if (response.length == 0) {
      res.status(404).json({ error: `No articles found` });
    } else {
      res.status(200).json(response);
    }
  }

  async updateOrCreateTopHomepageArticles(req, res) {
    const response = await articleService.updateOrCreateTopHomepageArticles(
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
    const response = await articleService.patchArticle(
      req.params.id,
      req.body.title,
      req.body.subtitle,
      req.body.description,
      req.body.main_image_url,
      req.body.date_written,
      req.body.article_type_id,
      req.body.user_id,
      req.body.country_id,
      req.body.place_id,
      req.body.airport_city_id
    );
    if (response.length == 0) {
      res.status(500).json({ error: `Error updating article ${id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async deleteArticle(req, res) {
    const { id } = req.params;
    const response = await articleService.deleteArticle(id);
    if (response) {
      res.status(200).json({});
    } else {
      res
        .status(500)
        .json({ error: `Error while deleting article with id ${id}` });
    }
  }
}

export default new ArticleController();
