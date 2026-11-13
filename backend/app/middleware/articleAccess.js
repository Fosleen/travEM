import db from "../models/index.js";

export const requireAdmin = (req, res, next) => {
  if (Number(req.user?.is_admin) !== 1) return res.status(403).json({ error: "Potreban je administratorski pristup." });
  next();
};

export async function requireArticleAccess(req, res, next) {
  try {
    const resource = req.baseUrl.split("/").pop();
    let articleId = req.params.id;
    if (resource !== "articles") {
      const model = { sections: "Section", "section-images": "SectionImage", "gallery-images": "GalleryImage", videos: "Video" }[resource];
      let record;
      if (req.method !== "POST") {
        record = await db.models[model].findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: "Sadržaj nije pronađen." });
      }
      if (resource === "section-images") {
        const section = await db.models.Section.findByPk(record?.sectionId ?? req.body.section_id);
        articleId = section?.articleId;
      } else articleId = record?.articleId ?? req.body.article_id;
      // Authors cannot attach content to a country/place or move existing content.
      if (Number(req.user.is_admin) !== 1 && (req.body.place_id || req.body.country_id ||
        (record && req.body.article_id !== undefined && Number(req.body.article_id) !== Number(articleId)) ||
        (record && req.body.section_id !== undefined && Number(req.body.section_id) !== Number(record.sectionId)))) {
        return res.status(403).json({ error: "Nije dopušteno premještanje sadržaja." });
      }
    }
    if (Number(req.user.is_admin) === 1) return next();
    const article = articleId && await db.models.Article.findByPk(articleId, { include: [{ model: db.models.ArticleReview, as: "review" }] });
    if (!article || Number(article.userId) !== Number(req.user.id)) return res.status(403).json({ error: "Možete uređivati samo svoje članke." });
    if (!article.review || article.review.status === "approved") return res.status(403).json({ error: "Odobreni članak može uređivati samo administrator." });
    req.article = article;
    next();
  } catch (error) { next(error); }
}

export function authorArticleFields(req, res, next) {
  if (Number(req.user.is_admin) !== 1) {
    req.body.user_id = req.user.id;
    req.body.is_tips_featured = false;
    req.body.domago_partner_enabled = undefined;
    if (typeof req.body.title !== "string" || !req.body.title.trim() || req.body.title.length > 100 ||
        typeof req.body.description !== "string" || req.body.description.length > 100) {
      return res.status(400).json({ error: "Naslov i opis smiju imati najviše 100 znakova; naslov je obavezan." });
    }
  } else if (req.method === "POST") req.body.user_id = req.user.id;
  next();
}

// Serialize author writes and approval on the same article row. Content writes
// clear the submission marker; only the final submit request makes it reviewable.
export const articleMutation = (handler) => async (req, res, next) => {
  if (Number(req.user.is_admin) === 1) {
    try { return await handler(req, res, next); } catch (error) { return next(error); }
  }
  const originalJson = res.json.bind(res);
  let responseBody;
  try {
    await db.sequelize.transaction(async (transaction) => {
      const article = await db.models.Article.findByPk(req.article.id, { transaction, lock: transaction.LOCK.UPDATE });
      const review = await db.models.ArticleReview.findByPk(req.article.id, { transaction });
      if (!article || Number(article.userId) !== Number(req.user.id) || !review || review.status === "approved") {
        const error = new Error("Članak više nije dostupan za uređivanje."); error.status = 403; throw error;
      }
      const submitting = req.path.endsWith("/submit-review");
      if (!submitting) await review.update({ submitted_at: null }, { transaction });
      req.articleTransaction = transaction;
      res.json = (body) => { responseBody = body; return res; };
      await handler(req, res, (error) => { throw error; });
      if (res.statusCode >= 400) {
        const error = new Error(responseBody?.error || "Spremanje nije uspjelo."); error.status = res.statusCode; throw error;
      }
    });
    res.json = originalJson;
    return res.json(responseBody);
  } catch (error) {
    res.json = originalJson;
    if (error.status) return res.status(error.status).json({ error: error.message });
    next(error);
  }
};
