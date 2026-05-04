import country from "../models/country.js";
import db from "../models/index.js";
import { Op } from "sequelize";

class PlacesService {
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
        ],
      });

      return place;
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
        ],
        where: {
          name: {
            [Op.startsWith]: name,
          },
        },
      });

      return {
        total: places.count,
        totalPages: Math.ceil(places.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        data: places.rows,
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
    country_id
  ) {
    try {
      const place = await db.models.Place.create({
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
      });

      return place;
    } catch (error) {
      console.log(error);
      return [];
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
    featured_article_id
  ) {
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
        });

        if (!featuredArticle) {
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
        }
      );

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
        ],
      });

      return updatedPlace;
    } catch (error) {
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