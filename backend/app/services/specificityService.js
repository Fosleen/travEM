import db from "../models/index.js";

class SpecificityService {
  async addSpecificities(title, country_id) {
    try {
      const specificity = await db.models.Specificity.create({
        title: title,
        countryId: country_id,
      });

      return specificity;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

export default new SpecificityService();
