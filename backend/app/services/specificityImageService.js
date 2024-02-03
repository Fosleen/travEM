import db from "../models/index.js";

class SpecificityImageService {
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
}

export default new SpecificityImageService();
