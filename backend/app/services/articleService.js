import db from "../models/index.js";
import { Op } from "sequelize";

class ArticleService {
  async getArticles(page, pageSize, articleType) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const optionalArticleTypeWhere = articleType
      ? { articleTypeId: articleType }
      : {};

    try {
      const articles = await db.models.Article.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [
          {
            model: db.models.ArticleType,
          },
          {
            model: db.models.Country,
          },
          {
            model: db.models.Place,
          },
        ],
        where: optionalArticleTypeWhere,
        order: [["date_written", "DESC"]],
      });

      return {
        total: articles.count,
        totalPages: Math.ceil(articles.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        data: articles.rows,
      };
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
            model: db.models.ArticleType,
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
    place_id,
    url
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

  async getArticleByName(name, page, pageSize) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    try {
      const articles = await db.models.Article.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [
          {
            model: db.models.Country,
          },
        ],
        where: {
          title: {
            [Op.startsWith]: name,
          },
        },
      });
      return {
        total: articles.count,
        totalPages: Math.ceil(articles.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        data: articles.rows,
      };
    } catch (error) {
      console.log(error);
      return `not found places starting with name ${name}`;
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

  async updateOrCreateTopHomepageArticles(article_ids, special_type_id) {
    console.log(Array.isArray(article_ids)); // Outputs: true

    try {
      console.log(special_type_id);

      const existingArticles =
        await db.models.Article_ArticleSpecialType.findAndCountAll({
          // nadi sve clanke koji imaju taj poseban tip
          where: {
            articleSpecialTypeId: special_type_id,
          },
        });

      if (
        special_type_id == 4 ||
        special_type_id == 5 ||
        special_type_id == 1 ||
        special_type_id == 3
      ) {
        {
          // provjeri nove vrijednosti koje nisu u bazi
          const valuesToAdd = article_ids.filter(
            (value) =>
              !existingArticles.rows.some((item) => item.articleId === value)
          );

          // articli koji vise nisu u ovom novom arrayu
          const valuesToRemove = [];
          existingArticles.rows.map((row) => {
            const articleIdToCheck = row.toJSON().articleId;

            if (!article_ids.includes(articleIdToCheck)) {
              valuesToRemove.push(row.toJSON().articleId);
            }
          });

          // zamijeni ih
          console.log(valuesToRemove);
          console.log(valuesToAdd);
          valuesToRemove.map(async (currRemoveValue, index) => {
            await db.models.Article_ArticleSpecialType.update(
              {
                articleId: valuesToAdd[index],
                articleSpecialTypeId: special_type_id,
              },
              {
                where: {
                  articleId: currRemoveValue,
                  articleSpecialTypeId: special_type_id,
                },
              }
            );
          });
        }
      }
      return { article_ids: article_ids, special_type_id: special_type_id };
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }

  async patchArticle(
    id,
    title,
    subtitle,
    description,
    main_image_url,
    date_written,
    article_type_id,
    user_id,
    country_id,
    place_id
  ) {
    console.log(id);

    try {
      await db.models.Article.update(
        {
          title: title,
          subtitle: subtitle,
          description: description,
          main_image_url: main_image_url,
          date_written: date_written,
          articleTypeId: article_type_id,
          userId: user_id,
          countryId: country_id,
          placeId: place_id,
        },
        {
          where: { id: id },
        }
      );

      const updatedArticle = await db.models.Article.findByPk(id);
      return updatedArticle;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteArticle(id) {
    try {
      await db.models.Article.destroy({
        where: { id: id },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new ArticleService();
