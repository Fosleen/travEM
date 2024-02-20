import db from "../models/index.js";

class GalleryImageService {
  async addGalleryImage(url, article_id, width, height) {
    try {
      const galleryImage = await db.models.GalleryImage.create({
        url: url,
        articleId: article_id,
        width: width,
        height: height,
      });
      return galleryImage;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async deleteGalleryImage(id) {
    try {
      await db.models.GalleryImage.destroy({
        where: { id: id },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new GalleryImageService();
