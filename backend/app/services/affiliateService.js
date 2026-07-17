import db from "../models/index.js";

const normalizeText = (value) => String(value || "").trim();

const assertHttpUrl = (value) => {
  const url = new URL(normalizeText(value));
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error("Affiliate URL must use http or https");
  }
  return url.toString();
};

class AffiliateService {
  async getPartners() {
    return db.models.AffiliatePartner.findAll({
      order: [["sort_order", "ASC"], ["name", "ASC"]],
    });
  }

  async addPartner(payload) {
    return db.models.AffiliatePartner.create({
      name: normalizeText(payload.name),
      label: normalizeText(payload.label),
      default_url: assertHttpUrl(payload.default_url),
      icon_url: normalizeText(payload.icon_url),
      sort_order: Number(payload.sort_order) || 0,
    });
  }

  async updatePartner(id, payload) {
    const partner = await db.models.AffiliatePartner.findByPk(id);
    if (!partner) return null;

    const updates = {};
    if (payload.name !== undefined) updates.name = normalizeText(payload.name);
    if (payload.label !== undefined) updates.label = normalizeText(payload.label);
    if (payload.icon_url !== undefined) {
      updates.icon_url = normalizeText(payload.icon_url);
    }
    if (payload.sort_order !== undefined) {
      updates.sort_order = Number(payload.sort_order) || 0;
    }
    if (payload.default_url !== undefined) {
      updates.default_url = assertHttpUrl(payload.default_url);
    }

    await partner.update(updates);
    return partner;
  }

  async syncArticleLinks(articleId, links) {
    const article = await db.models.Article.findByPk(articleId);
    if (!article) return null;

    return db.sequelize.transaction(async (transaction) => {
      await db.models.ArticleAffiliateLink.destroy({
        where: { articleId },
        transaction,
      });

      const rows = (Array.isArray(links) ? links : []).map((link, index) => ({
        articleId: Number(articleId),
        affiliatePartnerId: Number(link.affiliate_partner_id),
        url: link.url ? assertHttpUrl(link.url) : null,
        icon_url: normalizeText(link.icon_url) || null,
        is_enabled: link.is_enabled !== false,
        sort_order: Number.isFinite(Number(link.sort_order))
          ? Number(link.sort_order)
          : index,
      }));

      if (rows.length) {
        await db.models.ArticleAffiliateLink.bulkCreate(rows, { transaction });
      }

      return db.models.ArticleAffiliateLink.findAll({
        where: { articleId },
        include: [{ model: db.models.AffiliatePartner, as: "partner" }],
        order: [["sort_order", "ASC"]],
        transaction,
      });
    });
  }
}

export default new AffiliateService();
