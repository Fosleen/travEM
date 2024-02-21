import db from "../models/index.js";

class SpecificityItemService {
  async getSpecificityItemById(id) {
    try {
      const specificityItem = await db.models.SpecificityItem.findByPk(id);
      return specificityItem;
    } catch (error) {
      console.log(error);
      return `not found specificity item with PK ${id}`;
    }
  }

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

  async patchSpecificityItem(id, title, description, specificity_id) {
    try {
      await db.models.SpecificityItem.update(
        {
          title: title,
          description: description,
          specificity_id: specificity_id,
        },
        {
          where: { id: id },
        }
      );
      const updated = await db.models.SpecificityItem.findByPk(id);
      return updated;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteSpecificityItem(id) {
    try {
      await db.models.SpecificityItem.destroy({
        where: { id: id },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new SpecificityItemService();
