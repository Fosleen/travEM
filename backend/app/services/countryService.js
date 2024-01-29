import db from "../models/index.js";
import { Op } from "sequelize";

class CountriesService {
  async getCountries(page, pageSize) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    try {
      const visitedCountries = await db.models.Country.findAll({
        limit: limit,
        offset: offset,
      });
      return visitedCountries;
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
            model: db.models.Country,
          },
        ],
      });
      return country;
    } catch (error) {
      console.log(error);
      return `not found country with PK ${id}`;
    }
  }

  async getCountryByName(name) {
    try {
      const country = await db.models.Country.findAll({
        limit: 5,
        where: {
          name: {
            [Op.startsWith]: name,
          },
        },
      });
      return country;
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
}

export default new CountriesService();
