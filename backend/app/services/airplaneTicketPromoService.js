import db from "../models/index.js";
import { Op } from "sequelize";

const DEFAULT_PROMO = {
  top_text: "Ideš na svoj prvi let?\nEvo što sve trebaš znati",
  middle_text:
    "Praktični vodič za sve što trebaš znati prije nego odeš na svoj prvi let, i sve što možeš očekivati tijekom putovanja.",
  button_text: "Pročitaj vodič ✈︎",
  article_id: 356,
};

const getArticleScheduleInclude = () => ({
  model: db.models.ArticleSchedule,
  required: false,
});

const getPublicArticleWhere = (additionalWhere = {}) => ({
  ...additionalWhere,
  [Op.and]: [
    ...(additionalWhere[Op.and] || []),
    {
      [Op.or]: [
        { "$article_schedule.id$": null },
        { "$article_schedule.publish_at$": null },
        { "$article_schedule.publish_at$": { [Op.lte]: new Date() } },
      ],
    },
  ],
});

class AirplaneTicketPromoService {
  async getOrCreatePromo(transaction = null) {
    const [promo] = await db.models.AirplaneTicketPromo.findOrCreate({
      where: { id: 1 },
      defaults: DEFAULT_PROMO,
      transaction,
    });

    return promo;
  }

  async getFeaturedArticle(articleId, includeScheduled = false) {
    const featuredArticle = await db.models.Article.findOne({
      where: includeScheduled
        ? { id: articleId }
        : getPublicArticleWhere({ id: articleId }),
      include: [getArticleScheduleInclude()],
    });

    return featuredArticle;
  }

  async getPromo(includeScheduled = false) {
    try {
      const promo = await this.getOrCreatePromo();
      const plainPromo = promo.toJSON();
      const featuredArticle = await this.getFeaturedArticle(
        plainPromo.article_id,
        includeScheduled
      );

      return {
        ...plainPromo,
        featured_article: featuredArticle,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async patchPromo(top_text, middle_text, button_text, article_id) {
    const transaction = await db.sequelize.transaction();

    try {
      const promo = await this.getOrCreatePromo(transaction);
      const parsedArticleId = Number(article_id);

      if (!parsedArticleId || Number.isNaN(parsedArticleId)) {
        await transaction.rollback();
        return "Article not found";
      }

      const article = await db.models.Article.findByPk(parsedArticleId, {
        transaction,
      });

      if (!article) {
        await transaction.rollback();
        return "Article not found";
      }

      await promo.update(
        {
          top_text,
          middle_text,
          button_text,
          article_id: parsedArticleId,
        },
        { transaction }
      );

      await transaction.commit();
      return await this.getPromo(true);
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return null;
    }
  }
}

export default new AirplaneTicketPromoService();
