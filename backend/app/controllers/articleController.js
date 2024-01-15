import service from "../services/articleService.js";

class ArticleController {
  async getArticles(req, res) {
    const response = await service.getArticles();
    if (response == undefined) {
      res.status(404).json({ error: "No articles found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getArticleById(req, res) {
    const { id } = req.params;
    const response = await service.getArticleById(id);
    if (response == undefined) {
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
      req.body.article_type_id
    );

    if (response == undefined) {
      res.status(500).json({ error: "Error inserting article" });
    } else {
      res.status(200).json(response);
    }
  }

  async getHomepageArticles(req, res) {
    const response = await service.getHomepageArticles();
    if (response == undefined) {
      res.status(404).json({ error: "No articles for homepage found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getTopCountryArticle(req, res) {
    const { id } = req.params;
    const response = await service.getTopCountryArticle(id);
    if (response == undefined) {
      res.status(404).json({ error: `No articles for country ${id} found` });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new ArticleController();
