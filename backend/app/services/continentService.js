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
      return "Continent not found";
    }
  }

  async getContinentCountries(id) {
    try {
      const continent = await db.models.Continent.findByPk(id);
      if (!continent) {
        return "Continent not found";
      }

      const continentCountries = await db.models.Country.findAll({
        where: { continentId: id },
      });
      return continentCountries;
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
