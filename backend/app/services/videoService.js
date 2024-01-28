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
}

export default new VideoService();
