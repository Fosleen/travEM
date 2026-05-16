import db from "../models/index.js";
import { Op } from "sequelize";

const BEST_TIME_INCLUDE = {
  model: db.models.PlaceBestTimeToVisit,
  as: "best_time_to_visit",
  include: [
    {
      model: db.models.PlaceBestTimeToVisitMonth,
      as: "months",
    },
  ],
};

const MONTH_ORDER = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const FEATURED_ARTICLE_OVERVIEW_SECTION_LIMIT = 5;

const sortBestTimeMonths = (place) => {
  if (!place) return place;

  const plainPlace = place.toJSON ? place.toJSON() : place;

  if (plainPlace.best_time_to_visit?.months) {
    plainPlace.best_time_to_visit.months = [
      ...plainPlace.best_time_to_visit.months,
    ].sort(
      (a, b) =>
        MONTH_ORDER.indexOf(a.month_key) - MONTH_ORDER.indexOf(b.month_key)
    );
  }

  return plainPlace;
};

const shouldSaveBestTimeToVisit = (bestTimeToVisit) => {
  return (
    bestTimeToVisit &&
    bestTimeToVisit.slug &&
    Array.isArray(bestTimeToVisit.months) &&
    bestTimeToVisit.months.length > 0
  );
};

const normalizeMonthValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(String(value).replace(",", "."));

  return Number.isNaN(parsedValue) ? null : parsedValue;
};

class PlacesService {
  async getFeaturedArticleOverview(place) {
    if (!place) return null;

    const plainPlace = place.toJSON ? place.toJSON() : place;

    const featuredArticleId =
      plainPlace.featured_article_id || plainPlace.featuredArticleId || null;

    if (!featuredArticleId) {
      return null;
    }

    try {
      const featuredArticle = await db.models.Article.findOne({
        where: {
          id: featuredArticleId,
          placeId: plainPlace.id,
        },
        attributes: [
          "id",
          "title",
          "subtitle",
          "description",
          "main_image_url",
          "date_written",
          "date_updated",
          "isFarDestination",
          "isTipsFeatured",
          "articleTypeId",
          "countryId",
          "placeId",
          "userId",
          "airportCityId",
        ],
        include: [
          {
            model: db.models.Section,
            attributes: [
              "id",
              "subtitle",
              "order",
              "sectionIconId",
              "articleId",
            ],
            include: [
              {
                model: db.models.SectionIcon,
                attributes: ["id", "url"],
              },
            ],
          },
        ],
        order: [[{ model: db.models.Section }, "order", "ASC"]],
      });

      if (!featuredArticle) {
        return null;
      }

      const plainFeaturedArticle = featuredArticle.toJSON
        ? featuredArticle.toJSON()
        : featuredArticle;

      if (Array.isArray(plainFeaturedArticle.sections)) {
        plainFeaturedArticle.sections = plainFeaturedArticle.sections
          .filter((section) => section?.subtitle)
          .slice(0, FEATURED_ARTICLE_OVERVIEW_SECTION_LIMIT);
      }

      return plainFeaturedArticle;
    } catch (error) {
      console.log("Error fetching featured article overview:", error);
      return null;
    }
  }

  async enrichPlaceWithFeaturedArticleOverview(place) {
    if (!place) return place;

    const plainPlace = sortBestTimeMonths(place);
    const featuredArticle = await this.getFeaturedArticleOverview(plainPlace);

    return {
      ...plainPlace,
      featured_article: featuredArticle,
    };
  }

  async upsertBestTimeToVisit(placeId, bestTimeToVisit, transaction) {
    if (!shouldSaveBestTimeToVisit(bestTimeToVisit)) {
      return null;
    }

    const normalizedSlug = decodeURIComponent(bestTimeToVisit.slug)
      .trim()
      .toLowerCase();

    const months = bestTimeToVisit.months.map((month) => ({
      month_key: month.month_key,
      avg_temp_c: normalizeMonthValue(month.avg_temp_c),
      avg_rain_mm: normalizeMonthValue(month.avg_rain_mm),
    }));

    const hasInvalidMonths = months.some(
      (month) =>
        !MONTH_ORDER.includes(month.month_key) ||
        month.avg_temp_c === null ||
        month.avg_rain_mm === null
    );

    if (hasInvalidMonths) {
      return {
        error:
          "Podaci za najbolje vrijeme posjeta nisu ispravni. Svaki mjesec mora imati temperaturu i količinu kiše.",
      };
    }

    let bestTimeRecord = await db.models.PlaceBestTimeToVisit.findOne({
      where: { place_id: placeId },
      transaction,
    });

    if (!bestTimeRecord) {
      bestTimeRecord = await db.models.PlaceBestTimeToVisit.create(
        {
          place_id: placeId,
          slug: normalizedSlug,
          subtitle: bestTimeToVisit.subtitle || null,
          note: bestTimeToVisit.note || null,
          is_enabled:
            bestTimeToVisit.is_enabled === undefined
              ? true
              : Boolean(bestTimeToVisit.is_enabled),
        },
        { transaction }
      );
    } else {
      await bestTimeRecord.update(
        {
          slug: normalizedSlug,
          subtitle: bestTimeToVisit.subtitle || null,
          note: bestTimeToVisit.note || null,
          is_enabled:
            bestTimeToVisit.is_enabled === undefined
              ? true
              : Boolean(bestTimeToVisit.is_enabled),
        },
        { transaction }
      );
    }

    await db.models.PlaceBestTimeToVisitMonth.destroy({
      where: {
        place_best_time_to_visit_id: bestTimeRecord.id,
      },
      transaction,
    });

    await db.models.PlaceBestTimeToVisitMonth.bulkCreate(
      months.map((month) => ({
        place_best_time_to_visit_id: bestTimeRecord.id,
        month_key: month.month_key,
        avg_temp_c: month.avg_temp_c,
        avg_rain_mm: month.avg_rain_mm,
      })),
      { transaction }
    );

    return bestTimeRecord;
  }

  async getFavoritePlaces() {
    try {
      const favoritePlaces = await db.models.Place.findAll({
        include: [
          {
            model: db.models.Country,
            attributes: ["name"],
          },
        ],
        where: { is_on_homepage_map: 1 },
      });

      console.log("res je", favoritePlaces);

      return favoritePlaces;
    } catch (error) {
      return [];
    }
  }

  async getFeaturedPlaces() {
    try {
      const featuredPlaces = await db.models.Place.findAll({
        include: [
          {
            model: db.models.Country,
            attributes: ["name"],
          },
        ],
        where: { is_above_homepage_map: 1 },
      });

      return featuredPlaces;
    } catch (error) {
      return [];
    }
  }

  async getPlacesWithImage() {
    try {
      const featuredPlaces = await db.models.Place.findAll({
        where: { map_icon: { [Op.not]: null || "" } },
      });

      return featuredPlaces;
    } catch (error) {
      return [];
    }
  }

  async getPlaces(page, pageSize) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    try {
      const places = await db.models.Place.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [
          {
            model: db.models.Country,
          },
        ],
      });

      return {
        total: places.count,
        totalPages: Math.ceil(places.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        data: places.rows,
      };
    } catch (error) {
      return [];
    }
  }

  async getContinentCountries(id) {
    try {
      const continentCountries = await db.models.Country.findAll({
        where: { continent_id: id },
      });

      console.log("res je", continentCountries);

      return continentCountries;
    } catch (error) {
      return [];
    }
  }

  async getPlaceById(id) {
    try {
      const place = await db.models.Place.findByPk(id, {
        include: [
          {
            model: db.models.Video,
          },
          {
            model: db.models.Country,
          },
          {
            model: db.models.Article,
          },
          BEST_TIME_INCLUDE,
        ],
      });

      return await this.enrichPlaceWithFeaturedArticleOverview(place);
    } catch (error) {
      console.log(error);
      return `not found place with PK ${id}`;
    }
  }

  async getPlaceByName(name, page, pageSize) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    try {
      const places = await db.models.Place.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [
          {
            model: db.models.Video,
          },
          {
            model: db.models.Country,
          },
          {
            model: db.models.Article,
          },
          BEST_TIME_INCLUDE,
        ],
        where: {
          name: {
            [Op.startsWith]: name,
          },
        },
      });

      const rows = await Promise.all(
        places.rows.map((place) =>
          this.enrichPlaceWithFeaturedArticleOverview(place)
        )
      );

      return {
        total: places.count,
        totalPages: Math.ceil(places.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        data: rows,
      };
    } catch (error) {
      console.log(error);
      return `not found places starting with name ${name}`;
    }
  }

  async addPlace(
    name,
    name_genitive,
    name_dative,
    name_accusative,
    name_locative,
    description,
    main_image_url,
    map_icon,
    is_on_homepage_map,
    is_above_homepage_map,
    latitude,
    longitude,
    country_id,
    best_time_to_visit
  ) {
    const transaction = await db.sequelize.transaction();

    try {
      const place = await db.models.Place.create(
        {
          name: name,
          name_genitive: name_genitive,
          name_dative: name_dative,
          name_accusative: name_accusative,
          name_locative: name_locative,
          description: description,
          main_image_url: main_image_url,
          map_icon: map_icon,
          is_on_homepage_map: is_on_homepage_map,
          is_above_homepage_map: is_above_homepage_map,
          latitude: latitude,
          longitude: longitude,
          countryId: country_id,
        },
        { transaction }
      );

      const bestTimeResponse = await this.upsertBestTimeToVisit(
        place.id,
        best_time_to_visit,
        transaction
      );

      if (bestTimeResponse?.error) {
        await transaction.rollback();
        return bestTimeResponse;
      }

      await transaction.commit();

      return place;
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return null;
    }
  }

  async patchPlace(
    id,
    name,
    name_genitive,
    name_dative,
    name_accusative,
    name_locative,
    description,
    main_image_url,
    map_icon,
    is_on_homepage_map,
    is_above_homepage_map,
    latitude,
    longitude,
    country_id,
    featured_article_id,
    best_time_to_visit
  ) {
    const transaction = await db.sequelize.transaction();

    try {
      const parsedFeaturedArticleId =
        featured_article_id === null ||
        featured_article_id === undefined ||
        featured_article_id === ""
          ? null
          : Number(featured_article_id);

      if (parsedFeaturedArticleId) {
        const featuredArticle = await db.models.Article.findOne({
          where: {
            id: parsedFeaturedArticleId,
            placeId: id,
          },
          transaction,
        });

        if (!featuredArticle) {
          await transaction.rollback();

          return {
            error: "Odabrani istaknuti članak ne pripada ovom mjestu.",
          };
        }
      }

      await db.models.Place.update(
        {
          name: name,
          name_genitive: name_genitive,
          name_dative: name_dative,
          name_accusative: name_accusative,
          name_locative: name_locative,
          description: description,
          main_image_url: main_image_url,
          map_icon: map_icon,
          is_on_homepage_map: is_on_homepage_map,
          is_above_homepage_map: is_above_homepage_map,
          latitude: latitude,
          longitude: longitude,
          countryId: country_id,
          featured_article_id: parsedFeaturedArticleId,
        },
        {
          where: { id: id },
          transaction,
        }
      );

      const bestTimeResponse = await this.upsertBestTimeToVisit(
        id,
        best_time_to_visit,
        transaction
      );

      if (bestTimeResponse?.error) {
        await transaction.rollback();
        return bestTimeResponse;
      }

      await transaction.commit();

      const updatedPlace = await db.models.Place.findByPk(id, {
        include: [
          {
            model: db.models.Video,
          },
          {
            model: db.models.Country,
          },
          {
            model: db.models.Article,
          },
          BEST_TIME_INCLUDE,
        ],
      });

      return await this.enrichPlaceWithFeaturedArticleOverview(updatedPlace);
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return null;
    }
  }

  async deletePlaceAndArticles(id) {
    try {
      await db.models.Video.destroy({
        where: { placeId: id },
      });

      await db.models.Article.destroy({
        where: { placeId: id },
      });

      await db.models.Place.destroy({
        where: { id: id },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new PlacesService();