import db from "../models/index.js";

class PlacesService {
  async getCountries() {
    try {
      const visitedCountries = await db.models.Country.findAll();
      return visitedCountries;
    } catch (error) {
      return [];
    }
  }

  async getFavoritePlaces() {
    try {
      const favoritePlaces = await db.models.Place.findAll({
        where: { is_on_homepage_map: 1 },
      });
      console.log("res je", favoritePlaces);
      return favoritePlaces;
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
}

export default new PlacesService();
