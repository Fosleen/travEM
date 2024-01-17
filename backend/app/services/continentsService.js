import db from "../models/index.js";

class ContinentsService {
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

export default new ContinentsService();
