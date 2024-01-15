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

  async getArticleById(id) {
    try {
      const article = await db.models.Article.findByPk(id);
      return article;
    } catch (error) {
      console.log(error);
      return `not found article with PK ${id}`;
    }
  }

  async addArticle(
    title,
    subtitle,
    description,
    main_image_url,
    date_written,
    user_id,
    article_type_id
  ) {
    try {
      const article = await db.models.Article.create({
        title: title,
        subtitle: subtitle,
        description: description,
        main_image_url: main_image_url,
        date_written: date_written,
        userId: user_id, // vanjski kljucevi se moraju pisat camelcase, makar u bazi nisu tak...
        articleTypeId: article_type_id,
      });
      return article;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

export default new ArticleService();
