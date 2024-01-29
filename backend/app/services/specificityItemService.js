import db from "../models/index.js";

class SpecificityItemService {
  async addSpecificityItem(title, description, specificity_id) {
    try {
      const specificityItem = await db.models.SpecificityItem.create({
        title: title,
        description: description,
        specificityId: specificity_id,
      });

      return specificityItem;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

export default new SpecificityItemService();
