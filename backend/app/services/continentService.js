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
