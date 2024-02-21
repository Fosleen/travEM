import db from "../models/index.js";

class SectionImageService {
  async addSectionImage(url, section_id) {
    try {
      const sectionImage = await db.models.SectionImage.create({
        url: url,
        sectionId: section_id,
      });
      return sectionImage;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async deleteSectionImage(id) {
    try {
      await db.models.SectionImage.destroy({
        where: { id: id },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new SectionImageService();
