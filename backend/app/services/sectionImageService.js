import db from "../models/index.js";

class SectionImageService {
  async addSectionImage(url, section_id, width, height, transaction) {
    try {
      const sectionImage = await db.models.SectionImage.create({
        url: url,
        sectionId: section_id,
        width: width,
        height: height,
      }, { transaction });
      return sectionImage;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async patchSectionImage(url, id, width, height, transaction) {
    try {
      const sectionImage = await db.models.SectionImage.update(
        {
          url: url,
          width: width,
          height: height,
        },
        {
          where: { id: id },
          transaction,
        }
      );
      return sectionImage;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async deleteSectionImage(id, transaction) {
    try {
      await db.models.SectionImage.destroy({
        where: { id: id },
          transaction,
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new SectionImageService();
