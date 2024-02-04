import db from "../models/index.js";
import { Op } from "sequelize";

class CountriesService {
  async getCountries(page, pageSize) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    try {
      const visitedCountries = await db.models.Country.findAndCountAll({
        limit: limit,
        offset: offset,
      });

      const countriesWithArticleCount = await Promise.all(
        visitedCountries.rows.map(async (country) => {
          const articleCount = await db.models.Article.count({
            where: { countryId: country.id },
          });

          return {
            ...country.toJSON(),
            articleCount,
          };
        })
      );

      return {
        total: visitedCountries.count,
        totalPages: Math.ceil(visitedCountries.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        data: countriesWithArticleCount,
      };
    } catch (error) {
      return [];
    }
  }

  async getCountryById(id) {
    try {
      const country = await db.models.Country.findByPk(id, {
        include: [
          {
            model: db.models.VisaInfo,
          },
          {
            model: db.models.Color,
          },
          {
            model: db.models.Continent,
          },
          {
            model: db.models.Specificity,
            include: [
              {
                model: db.models.SpecificityImage,
              },
              {
                model: db.models.SpecificityItem,
              },
            ],
          },
          {
            model: db.models.Place,
          },
          {
            model: db.models.Video,
          },
          {
            model: db.models.Characteristic,
            include: [
              {
                model: db.models.CharacteristicIcon,
              },
            ],
          },
          {
            model: db.models.Article,
          },
        ],
      });
      return country;
    } catch (error) {
      console.log(error);
      return `not found country with PK ${id}`;
    }
  }

  async getCountryByName(name, page, pageSize) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    try {
      const countries = await db.models.Country.findAndCountAll({
        limit: limit,
        offset: offset,
        where: {
          name: {
            [Op.startsWith]: name,
          },
        },
      });

      const countriesWithArticleCount = await Promise.all(
        countries.rows.map(async (country) => {
          const articleCount = await db.models.Article.count({
            where: { countryId: country.id },
          });

          return {
            ...country.toJSON(),
            articleCount,
          };
        })
      );

      return {
        total: countries.count,
        totalPages: Math.ceil(countries.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        data: countriesWithArticleCount,
      };
    } catch (error) {
      console.log(error);
      return `not found countries starting with name ${name}`;
    }
  }

  async getCountryPlaces(id) {
    try {
      const countryPlaces = await db.models.Place.findAll({
        where: { country_id: id },
      });
      return countryPlaces;
    } catch (error) {
      return [];
    }
  }

  async patchCountry(
    id,
    name,
    description,
    main_image_url,
    flag_image_url,
    user_id,
    continent_id
  ) {
    console.log(id);

    try {
      await db.models.Country.update(
        {
          name: name,
          description: description,
          main_image_url: main_image_url,
          flag_image_url: flag_image_url,
          userId: user_id,
          colorId: color_id,
          continentId: continent_id,
        },
        {
          where: { id: id },
        }
      );

      const updatedCountry = await db.models.Country.findByPk(id);
      return updatedCountry;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteCountry(id) {
    try {
      await db.models.Country.destroy({
        where: { id: id },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addCountry(
    name,
    description,
    main_image_url,
    flag_image_url,
    continent_id,
    color_id
  ) {
    try {
      const country = await db.models.Country.create({
        name: name,
        description: description,
        main_image_url: main_image_url,
        flag_image_url: flag_image_url,
        continentId: continent_id,
        colorId: color_id,
      });

      return country;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

export default new CountriesService();
