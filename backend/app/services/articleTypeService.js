import db from "../models/index.js";

class ArticleTypeService {
  async getArticleTypes() {
    try {
      const articleTypes = await db.models.ArticleType.findAll();
      return articleTypes;
    } catch (error) {
      return [];
    }
  }
}

export default new ArticleTypeService();
