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
            through: db.models.Article_ArticleSpecialType,
          },
        ],
        order: [[{ model: db.models.Section }, "order", "ASC"]],
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
    article_type_id,
    country_id,
    place_id
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
        countryId: country_id,
        placeId: place_id,
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
            through: db.models.Article_ArticleSpecialType,
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
          countryId: id,
        },
        include: [
          {
            model: db.models.ArticleSpecialType,
            through: db.models.Article_ArticleSpecialType,
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

  async getArticlesByCountryId(id) {
    try {
      const articles = await db.models.Article.findAll({
        where: {
          countryId: id,
        },
      });
      return articles;
    } catch (error) {
      return [];
    }
  }

  async getArticlesByPlaceId(id) {
    try {
      const articles = await db.models.Article.findAll({
        where: {
          placeId: id,
        },
      });
      return articles;
    } catch (error) {
      return [];
    }
  }

  async updateOrCreateTopCountryArticle(article_id) {
    try {
      const article = await db.models.Article.findByPk(article_id);
      const countryId = article.toJSON().countryId;

      const existingArticle =
        await db.models.Article_ArticleSpecialType.findOne({
          where: {
            articleSpecialTypeId: 2,
          },
          include: {
            model: db.models.Article, // ovo se moze zbog super many to many veze
            where: {
              countryId: countryId,
            },
          },
        });

      console.log(existingArticle);

      if (existingArticle) {
        //vec postoji top clanak za ovu drzavu - update
        const oldTopArticleId = existingArticle.toJSON().article.id;
        await db.models.Article_ArticleSpecialType.update(
          {
            articleId: article_id,
            articleSpecialTypeId: 2,
          },
          { where: { articleId: oldTopArticleId } }
        );
      } else {
        // jos ne postoji top clanak za ovu drzavu - insert
        await db.models.Article_ArticleSpecialType.create({
          articleId: article_id,
          articleSpecialTypeId: 2, // 2 = top country article
        });
      }

      return article;
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }
}

export default new ArticleService();
