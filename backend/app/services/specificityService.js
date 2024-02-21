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

  async patchSpecificities(id, title, country_id) {
    try {
      await db.models.Specificity.update(
        {
          title: title,
          countryId: country_id,
        },
        {
          where: { id: id },
        }
      );

      const updatedSpecificity = await db.models.Specificity.findByPk(id);
      return updatedSpecificity;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new SpecificityService();
