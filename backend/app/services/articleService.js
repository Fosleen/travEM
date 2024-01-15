import db from "../models/index.js";

class ArticleService {
  async getArticles() {
    try {
      const articles = await db.models.Article.findAll();
      return articles;
    } catch (error) {
      return [];
    }
  }
}

export default new ArticleService();
