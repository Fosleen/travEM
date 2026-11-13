import db from "../models/index.js";

class GalleryImageService {
  async addGalleryImage(url, article_id, width, height, transaction) {
    try {
      const galleryImage = await db.models.GalleryImage.create({
        url: url,
        articleId: article_id,
        width: width,
        height: height,
      }, { transaction });
      return galleryImage;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async deleteGalleryImage(id, transaction) {
    try {
      await db.models.GalleryImage.destroy({
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

export default new GalleryImageService();
