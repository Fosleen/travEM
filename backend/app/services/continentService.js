import db from "../models/index.js";

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
      return `not found continent with PK ${id}`;
    }
  }

  async getContinentCountries(id) {
    try {
      const continentCountries = await db.models.Country.findAll({
        where: { continentId: id },
      });
      return continentCountries;
    } catch (error) {
      return [];
    }
  }

  async getContinentPlaces(id) {
    try {
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
      return [];
    }
  }
}

export default new ContinentsService();
