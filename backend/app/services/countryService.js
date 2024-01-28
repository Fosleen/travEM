import db from "../models/index.js";

class CountriesService {
  async getCountries() {
    try {
      const visitedCountries = await db.models.Country.findAll();
      return visitedCountries;
    } catch (error) {
      return [];
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
