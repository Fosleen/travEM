import db from "../models/index.js";
import { Op } from "sequelize";
import { approvedArticleWhere } from "../utils/articleReviewVisibility.js";

class VideoService {
  async getVideos() {
    try {
      const videos = await db.models.Video.findAll({
        include: [{ model: db.models.Article, attributes: [], required: false, include: [{ model: db.models.ArticleSchedule, attributes: [], required: false }] }],
        where: {
        [Op.or]: [
          { articleId: null },
          { [Op.and]: [approvedArticleWhere("articleId"), { "$article.is_deal_draft$": false }, {
            [Op.or]: [{ "$article.article_schedule.publish_at$": null }, { "$article.article_schedule.publish_at$": { [Op.lte]: new Date() } }],
          }] },
        ],
      } });
      return videos;
    } catch (error) {
      return [];
    }
  }

  async addVideo(url, article_id, place_id, country_id, transaction) {
    console.log(url);
    try {
      const video = await db.models.Video.create({
        url: url,
        articleId: article_id,
        placeId: place_id,
        countryId: country_id,
      }, { transaction });
      return video;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async patchVideo(id, url, article_id, place_id, country_id, transaction) {
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
          transaction,
        }
      );

      const updatedVideo = await db.models.Video.findByPk(id, { transaction });
      return updatedVideo;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteVideo(id, transaction) {
    try {
      await db.models.Video.destroy({
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

export default new VideoService();
