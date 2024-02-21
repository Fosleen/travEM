import db from "../models/index.js";

class SpecificityImageService {
  async getSpecificityImageById(id) {
    try {
      const specificityImage = await db.models.SpecificityImage.findByPk(id);
      return specificityImage;
    } catch (error) {
      console.log(error);
      return `not found specificity image with PK ${id}`;
    }
  }

  async addSpecificityImage(url, specificity_id) {
    try {
      const specificityImage = await db.models.SpecificityImage.create({
        url: url,
        specificityId: specificity_id,
      });

      return specificityImage;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async patchSpecificityImage(id, url, specificity_id) {
    try {
      await db.models.SpecificityImage.update(
        {
          url: url,

          specificity_id: specificity_id,
        },
        {
          where: { id: id },
        }
      );
      const updated = await db.models.SpecificityImage.findByPk(id);
      return updated;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteSpecificityImage(id) {
    try {
      await db.models.SpecificityImage.destroy({
        where: { id: id },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new SpecificityImageService();
