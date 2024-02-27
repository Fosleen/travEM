import db from "../models/index.js";

class VideoService {
  async getVideos() {
    try {
      const videos = await db.models.Video.findAll();
      return videos;
    } catch (error) {
      return [];
    }
  }

  async addVideo(url, article_id, place_id, country_id) {
    console.log(url);
    try {
      const video = await db.models.Video.create({
        url: url,
        articleId: article_id,
        placeId: place_id,
        countryId: country_id,
      });
      return video;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async patchVideo(id, url, article_id, place_id, country_id) {
    try {
      await db.models.Video.update(
        {
          url: url,
          articleId: article_id,
          placeId: place_id,
          countryId: country_id,
        },
        {
          where: { id: id },
        }
      );

      const updatedVideo = await db.models.Video.findByPk(id);
      return updatedVideo;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteVideo(id) {
    try {
      await db.models.Video.destroy({
        where: { id: id },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new VideoService();
