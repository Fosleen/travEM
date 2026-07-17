import db from "../models/index.js";
import { Op } from "sequelize";

const NEW_COUNTRIES_LIMIT = 3;

const getArticleScheduleInclude = () => ({
  model: db.models.ArticleSchedule,
  attributes: [],
  required: false,
});

const getPublicArticleWhere = (additionalWhere = {}) => ({
  ...additionalWhere,
  [Op.and]: [
    ...(additionalWhere[Op.and] || []),
    {
      [Op.or]: [
        { "$article_schedule.id$": null },
        { "$article_schedule.publish_at$": null },
        { "$article_schedule.publish_at$": { [Op.lte]: new Date() } },
      ],
    },
  ],
});

class ContinentsService {
  async getContinents() {
    try {
      const continents = await db.models.Continent.findAll();
      return continents;
    } catch (error) {
      return [];
    }
  }

  async getContinentById(id) {
    try {
      const continent = await db.models.Continent.findByPk(id);
      return continent;
    } catch (error) {
      console.log(error);
      return "Continent not found";
    }
  }

  async getContinentCountries(id) {
    try {
      const continent = await db.models.Continent.findByPk(id);
      if (!continent) {
        return "Continent not found";
      }

      const latestCountryArticleRows = await db.models.Article.findAll({
        attributes: [
          "countryId",
          [
            db.sequelize.fn(
              "MAX",
              db.sequelize.fn(
                "COALESCE",
                db.sequelize.col("date_updated"),
                db.sequelize.col("date_written")
              )
            ),
            "latestArticleDate",
          ],
        ],
        include: [getArticleScheduleInclude()],
        where: getPublicArticleWhere({
          countryId: {
            [Op.ne]: null,
          },
        }),
        group: ["countryId"],
        order: [[db.sequelize.literal("latestArticleDate"), "DESC"]],
        limit: NEW_COUNTRIES_LIMIT,
      });

      const latestCountryIds = latestCountryArticleRows.map(
        (article) => article.countryId
      );

      const continentCountries = await db.models.Country.findAll({
        where: { continentId: id },
      });

      return continentCountries.map((country) => ({
        ...country.toJSON(),
        is_new: latestCountryIds.includes(country.id),
      }));
    } catch (error) {
      return error;
    }
  }

  async getContinentPlaces(id) {
    try {
      const continent = await db.models.Continent.findByPk(id);
      if (!continent) {
        return "Continent not found";
      }

      const continentPlaces = await db.models.Place.findAll({
        include: [
          {
            model: db.models.Country,
            attributes: [],
            where: { continentId: id },
          },
        ],
      });
      return continentPlaces;
    } catch (error) {
      return error;
    }
  }
}

export default new ContinentsService();
