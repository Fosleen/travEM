import db from "../models/index.js";

class MapService {
  async getCountries() {
    try {
      const visitedCountries = await db.models.Country.findAll();
      return visitedCountries;
    } catch (error) {
      return [];
    }
  }
}

export default new MapService();
