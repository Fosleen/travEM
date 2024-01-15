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
      const article = await db.models.Article.findByPk(id, {
        include: [
          {
            model: db.models.User,
          },
          {
            model: db.models.GalleryImage,
          },
          {
            model: db.models.Video,
          },
          {
            model: db.models.Country,
          },
          {
            model: db.models.Place,
          },
          {
            model: db.models.Section,
            include: [
              {
                model: db.models.SectionImage,
              },
            ],
          },
          {
            model: db.models.ArticleSpecialType,
            through: "article_has_article_special_type",
          },
        ],
      });
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

  // dohvati clanke koji u vise vise tablici imaju samo veze s homepageom (prema id-u special article typea)
  async getHomepageArticles() {
    try {
      const articles = await db.models.Article.findAll({
        include: [
          {
            model: db.models.ArticleSpecialType,
            through: "article_has_article_special_type",
            where: {
              id: [1, 3, 4, 5],
            },
          },
        ],
      });
      return articles;
    } catch (error) {
      return [];
    }
  }

  async getTopCountryArticle(id) {
    try {
      const articles = await db.models.Article.findAll({
        where: {
          countryId: id
        },
        include: [
          {
            model: db.models.ArticleSpecialType,
            through: "article_has_article_special_type",
            where: {
              id: 2,
            },
          },
        ],
      });
      return articles;
    } catch (error) {
      return [];
    }
  }
}

export default new ArticleService();
