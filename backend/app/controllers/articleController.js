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
}

export default new ArticleController();
