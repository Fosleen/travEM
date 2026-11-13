import db from "../models/index.js";
import articleService from "../services/articleService.js";
import { clearCacheByPattern } from "../middleware/redis.js";

const reviewInclude = { model: db.models.ArticleReview, as: "review" };
const scheduleInclude = { model: db.models.ArticleSchedule };
const clearArticleCaches = () => Promise.all([
  clearCacheByPattern("article*"), clearCacheByPattern("homepage*"),
  clearCacheByPattern("continent-countries:*"), clearCacheByPattern("countries-page:*"),
  clearCacheByPattern("country*"), clearCacheByPattern("place*"), clearCacheByPattern("top-country-article*"),
  clearCacheByPattern("airplane-ticket-promo*"),
]);

export default {
  async list(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const pageSize = Math.min(200, Math.max(1, parseInt(req.query.pageSize) || 12));
      const owner = Number(req.user.is_admin) === 1 ? null : req.user.id;
      const result = req.query.search
        ? await articleService.getArticleBySearchTerm(String(req.query.search), page, pageSize, true, owner)
        : await articleService.getArticles(page, pageSize, parseInt(req.query.articleType) || null, true, owner);
      res.set("Cache-Control", "private, no-store");
      res.json(result);
    } catch (error) { next(error); }
  },
  async detail(req, res, next) {
    try {
      const record = await db.models.Article.findByPk(req.params.id);
      if (!record || (Number(req.user.is_admin) !== 1 && Number(record.userId) !== Number(req.user.id))) return res.status(404).json({ error: "Članak nije pronađen." });
      const article = await articleService.getArticleById(record.id, true);
      if (!article) return res.status(404).json({ error: "Članak nije pronađen." });
      if (Number(req.user.is_admin) !== 1) {
        article.setDataValue("affiliate_links", []);
        article.setDataValue("article_special_types", []);
      }
      res.set("Cache-Control", "private, no-store");
      res.json(article);
    } catch (error) { next(error); }
  },
  async submit(req, res, next) {
    try {
      if (Number(req.user.is_admin) === 1) return res.status(400).json({ error: "Administratorski članci ne zahtijevaju pregled." });
      const [updated] = await db.models.ArticleReview.update({ status: "pending", submitted_at: new Date(), reviewed_at: null, reviewed_by: null }, {
        where: { article_id: req.params.id, status: ["pending", "changes_requested"] },
        transaction: req.articleTransaction,
      });
      if (!updated) return res.status(409).json({ error: "Članak više nije dostupan za predaju." });
      res.json({ success: true });
    } catch (error) { next(error); }
  },
  async review(req, res, next) {
    try {
      const { action, note, publish_at, notify_subscribers_on_publish } = req.body;
      if (!["approve", "return"].includes(action)) return res.status(400).json({ error: "Nepoznata odluka." });
      if (action === "approve" && notify_subscribers_on_publish !== undefined && typeof notify_subscribers_on_publish !== "boolean") {
        return res.status(400).json({ error: "Odabir slanja newslettera mora biti uključen ili isključen." });
      }
      await db.sequelize.transaction(async (transaction) => {
        const article = await db.models.Article.findByPk(req.params.id, { include: [reviewInclude, scheduleInclude], transaction, lock: transaction.LOCK.UPDATE });
        if (!article?.review || article.review.status !== "pending" || !article.review.submitted_at) {
          const error = new Error("Članak nije spreman za pregled."); error.status = 409; throw error;
        }
        if (action === "return" && !String(note || "").trim()) {
          const error = new Error("Napišite napomenu za autora."); error.status = 400; throw error;
        }
        if (action === "approve") {
          const existingDate = article.article_schedule?.publish_at;
          const chosenDate = publish_at === undefined ? existingDate : publish_at;
          if (chosenDate && (!Number.isFinite(new Date(chosenDate).getTime()) || new Date(chosenDate).getTime() <= Date.now())) {
            const error = new Error("Termin je prošao. Odaberite objavu odmah ili novi budući termin."); error.status = 400; throw error;
          }
          if (article.article_schedule) {
            await article.article_schedule.update({
              publish_at: chosenDate || new Date(),
              publish_processed_at: null,
              ...(notify_subscribers_on_publish !== undefined ? { notify_subscribers_on_publish } : {}),
            }, { transaction });
          } else {
            await db.models.ArticleSchedule.create({
              articleId: article.id,
              publish_at: chosenDate || new Date(),
              notify_subscribers_on_publish: notify_subscribers_on_publish ?? false,
            }, { transaction });
          }
        }
        await article.review.update({ status: action === "approve" ? "approved" : "changes_requested", reviewed_at: new Date(), reviewed_by: req.user.id, note: String(note || "").trim() || null }, { transaction });
      });
      await clearArticleCaches();
      res.json({ success: true });
    } catch (error) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      next(error);
    }
  },
};
