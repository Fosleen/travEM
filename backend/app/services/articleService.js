import db from "../models/index.js";
import { Op, Sequelize } from "sequelize";

const isTipsArticleType = async (articleTypeId, transaction = null) => {
  const normalizedArticleTypeId = Number(articleTypeId);

  if (!normalizedArticleTypeId || Number.isNaN(normalizedArticleTypeId)) {
    return false;
  }

  const articleType = await db.models.ArticleType.findByPk(
    normalizedArticleTypeId,
    {
      transaction,
    }
  );

  return parseBooleanValue(articleType?.isTipsType);
};

const parseBooleanValue = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    return normalizedValue === "1" || normalizedValue === "true";
  }

  return false;
};



const normalizeNullableId = (value) => {
  const parsedValue = Number(value);

  if (
    value === null ||
    value === undefined ||
    value === "" ||
    Number.isNaN(parsedValue)
  ) {
    return null;
  }

  return parsedValue;
};

class ArticleService {
  async resetOtherTipsFeaturedArticles(
    articleTypeId,
    currentArticleId,
    transaction
  ) {
    if (!(await isTipsArticleType(articleTypeId, transaction))) {
      return;
    }

    const where = {
      articleTypeId: Number(articleTypeId),
    };

    if (currentArticleId) {
      where.id = {
        [Op.ne]: Number(currentArticleId),
      };
    }

    await db.models.Article.update(
      {
        isTipsFeatured: false,
      },
      {
        where,
        transaction,
      }
    );
  }

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
            model: db.models.AirportCity,
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
      console.log(error);
      return [];
    }
  }

  async getTipsFeaturedArticle(articleTypeId) {
    try {
      const normalizedArticleTypeId = Number(articleTypeId);

      if (!(await isTipsArticleType(normalizedArticleTypeId))) {
        return null;
      }

      const featuredArticle = await db.models.Article.findOne({
        where: {
          articleTypeId: normalizedArticleTypeId,
          isTipsFeatured: true,
        },
        include: [
          {
            model: db.models.ArticleType,
          },
          {
            model: db.models.AirportCity,
          },
          {
            model: db.models.Country,
          },
          {
            model: db.models.Place,
          },
        ],
        order: [["date_written", "DESC"]],
      });

      if (featuredArticle) {
        return featuredArticle;
      }

      const newestArticle = await db.models.Article.findOne({
        where: {
          articleTypeId: normalizedArticleTypeId,
        },
        include: [
          {
            model: db.models.ArticleType,
          },
          {
            model: db.models.AirportCity,
          },
          {
            model: db.models.Country,
          },
          {
            model: db.models.Place,
          },
        ],
        order: [["date_written", "DESC"]],
      });

      return newestArticle;
    } catch (error) {
      console.log(error);
      return null;
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
              {
                model: db.models.SectionIcon,
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

  async getRecommendedArticles(id, type) {
    const recommendedArticles = [];
    let nmbrSameType = 0;
    let nmbrSamePlace = 0;
    let nmbrSameCountry = 0;

    if (type == "article") {
      const startingArticle = await db.models.Article.findByPk(id);

      if (!startingArticle) {
        return "No starting article found";
      }

      if (startingArticle.articleTypeId == 1) {
        {
          startingArticle.placeId && (nmbrSamePlace = 2);
        }
        {
          startingArticle.placeId
            ? (nmbrSameCountry = 2)
            : (nmbrSameCountry = 4);
        }
      } else if (
        startingArticle.articleTypeId == 2 ||
        (await isTipsArticleType(startingArticle.articleTypeId))
        ) {
        nmbrSameType = 4;
      }

      if (nmbrSameType > 0) {
        let articlesSameType;

        if (await isTipsArticleType(startingArticle.articleTypeId)) {
          articlesSameType = await db.models.Article.findAll({
            where: {
              articleTypeId: startingArticle.articleTypeId,
              id: { [Op.notIn]: [id] },
            },
            order: Sequelize.literal("rand()"),
            limit: nmbrSameType,
          });
        } else if (startingArticle.articleTypeId == 2) {
          articlesSameType = await db.models.Article.findAll({
            where: {
              articleTypeId: startingArticle.articleTypeId,
              id: { [Op.notIn]: [id] },
            },
            order: [["date_written", "DESC"]],
            limit: nmbrSameType,
          });
        }

        articlesSameType.forEach((el) => {
          recommendedArticles.push(el);
        });
      }

      if (nmbrSamePlace > 0) {
        const articlesSamePlace = await db.models.Article.findAll({
          where: {
            placeId: startingArticle.placeId,
            id: { [Op.notIn]: [id] },
          },
          order: Sequelize.literal("rand()"),
          limit: nmbrSamePlace,
        });

        articlesSamePlace.forEach((el) => {
          recommendedArticles.push(el);
        });
      }

      if (nmbrSameCountry > 0) {
        const articlesSameCountry = await db.models.Article.findAll({
          where: {
            countryId: startingArticle.countryId,
            id: {
              [Op.notIn]: [
                id,
                ...recommendedArticles.map((article) => article.id),
              ],
            },
          },
          order: Sequelize.literal("rand()"),
          limit: nmbrSameCountry,
        });

        articlesSameCountry.forEach((el) => {
          recommendedArticles.push(el);
        });
      }
    } else if (type == "country-page" || type == "place-page") {
      let startingDestination = null;

      if (type == "place-page") {
        startingDestination = await db.models.Place.findByPk(id);
      } else {
        startingDestination = await db.models.Country.findByPk(id);
      }

      const articlesSelectedCountry = await db.models.Article.findAll({
        where: {
          countryId:
            type == "place-page"
              ? startingDestination.countryId
              : startingDestination.id,
          id: {
            [Op.notIn]: [id, ...recommendedArticles.map((el) => el.id)],
          },
        },
        order: Sequelize.literal("rand()"),
        limit: 2,
      });

      articlesSelectedCountry.forEach((element) => {
        recommendedArticles.push(element);
      });
    }

    if (recommendedArticles.length != 4) {
      const randomArticles = await db.models.Article.findAll({
        where: {
          articleTypeId: 1,
          id: {
            [Op.notIn]: [
              id,
              ...recommendedArticles.map((article) => article.id),
            ],
          },
        },
        order: Sequelize.literal("rand()"),
        limit: 4 - recommendedArticles.length,
      });

      randomArticles.forEach((el) => {
        recommendedArticles.push(el);
      });
    }

    return recommendedArticles;
  }

  async addArticle(
    title,
    subtitle,
    description,
    main_image_url,
    date_written,
    date_updated,
    metatags,
    user_id,
    article_type_id,
    country_id,
    place_id,
    airport_city_id,
    is_far_destination,
    is_tips_featured
  ) {
    const transaction = await db.sequelize.transaction();

    try {
      const normalizedArticleTypeId = Number(article_type_id);
      const shouldBeTipsFeatured =
        (await isTipsArticleType(normalizedArticleTypeId, transaction)) &&
        parseBooleanValue(is_tips_featured);

      if (shouldBeTipsFeatured) {
        await this.resetOtherTipsFeaturedArticles(
          normalizedArticleTypeId,
          null,
          transaction
        );
      }

      const article = await db.models.Article.create(
        {
          title: title,
          subtitle: subtitle,
          description: description,
          main_image_url: main_image_url,
          date_written: date_written,
          date_updated: date_updated || null,
          metatags: metatags,
          userId: normalizeNullableId(user_id),
          articleTypeId: normalizedArticleTypeId,
          countryId: normalizeNullableId(country_id),
          placeId: normalizeNullableId(place_id),
          airportCityId: normalizeNullableId(airport_city_id),
          isFarDestination: parseBooleanValue(is_far_destination),
          isTipsFeatured: shouldBeTipsFeatured,
        },
        {
          transaction,
        }
      );

      await transaction.commit();

      return article;
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return [];
    }
  }

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
          {
            model: db.models.Country,
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
      const article = await db.models.Article.findOne({
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
          {
            model: db.models.Section,
            include: [
              {
                model: db.models.SectionIcon,
              },
            ],
          },
        ],
        order: [[{ model: db.models.Section }, "order", "ASC"]],
      });

      return article;
    } catch (error) {
      console.log(error);
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

  async getArticleBySearchTerm(name, page, pageSize) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    try {
      const searchTermWithoutLastLetter = `%${name.slice(0, -1)}%`;

      const articles = await db.models.Article.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [
          {
            model: db.models.Country,
          },
        ],
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: searchTermWithoutLastLetter,
              },
            },
            {
              metatags: {
                [Op.like]: searchTermWithoutLastLetter,
              },
            },
          ],
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

      if (!article) {
        return "Article not found";
      } else {
        const countryId = article.toJSON().countryId;
        console.log(countryId);

        if (!countryId) {
          return "Article country not found";
        } else {
          const existingArticle =
            await db.models.Article_ArticleSpecialType.findOne({
              where: {
                articleSpecialTypeId: 2,
              },
              include: {
                model: db.models.Article,
                where: {
                  countryId: countryId,
                },
              },
            });

          let response = null;

          if (existingArticle) {
            const oldTopArticleId = existingArticle.toJSON().article.id;

            response = await db.models.Article_ArticleSpecialType.update(
              { articleId: article_id },
              { where: { articleId: oldTopArticleId, articleSpecialTypeId: 2 } }
            );
          } else {
            console.log("ne postoji");

            response = await db.models.Article_ArticleSpecialType.create({
              articleId: article_id,
              articleSpecialTypeId: 2,
            });
          }

          console.log(response);
          return article;
        }
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async updateOrCreateTopHomepageArticles(article_ids, special_type_id) {
    console.log(Array.isArray(article_ids));

    try {
      console.log(special_type_id);

      const existingArticles =
        await db.models.Article_ArticleSpecialType.findAndCountAll({
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
          const valuesToAdd = article_ids.filter(
            (value) =>
              !existingArticles.rows.some((item) => item.articleId === value)
          );

          const valuesToRemove = [];

          existingArticles.rows.map((row) => {
            const articleIdToCheck = row.toJSON().articleId;

            if (!article_ids.includes(articleIdToCheck)) {
              valuesToRemove.push(row.toJSON().articleId);
            }
          });

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
    metatags,
    main_image_url,
    date_written,
    date_updated,
    article_type_id,
    user_id,
    country_id,
    place_id,
    airport_city_id,
    is_far_destination,
    is_tips_featured
  ) {
    console.log("patchArticle");

    const transaction = await db.sequelize.transaction();

    try {
      const articleToUpdate = await db.models.Article.findByPk(id, {
        transaction,
      });

      if (!articleToUpdate) {
        await transaction.rollback();
        return "Article not found";
      }

      const normalizedArticleTypeId = Number(article_type_id);
      const shouldBeTipsFeatured =
      (await isTipsArticleType(normalizedArticleTypeId, transaction)) &&
      parseBooleanValue(is_tips_featured);

      if (shouldBeTipsFeatured) {
        await this.resetOtherTipsFeaturedArticles(
          normalizedArticleTypeId,
          id,
          transaction
        );
      }

      await db.models.Article.update(
        {
          title: title,
          subtitle: subtitle,
          description: description,
          metatags: metatags,
          main_image_url: main_image_url,
          date_written: date_written,
          date_updated: date_updated || null,
          articleTypeId: normalizedArticleTypeId,
          userId: normalizeNullableId(user_id) || articleToUpdate.userId,
          countryId: normalizeNullableId(country_id),
          placeId: normalizeNullableId(place_id),
          airportCityId: normalizeNullableId(airport_city_id),
          isFarDestination: parseBooleanValue(is_far_destination),
          isTipsFeatured: shouldBeTipsFeatured,
        },
        {
          where: { id: id },
          transaction,
        }
      );

      const updatedArticle = await db.models.Article.findByPk(id, {
        transaction,
      });

      await transaction.commit();

      console.log("updatedArticle", updatedArticle);

      return updatedArticle;
    } catch (error) {
      await transaction.rollback();
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

  async deleteTopCountryArticle(id) {
    try {
      await db.models.Article_ArticleSpecialType.destroy({
        where: {
          articleId: id,
          articleSpecialTypeId: 2,
        },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new ArticleService();