import db from "../models/index.js";

const normalizeText = (value) => String(value || "").trim();

const assertHttpUrl = (value, fieldName) => {
  const url = new URL(normalizeText(value));
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`${fieldName} must use http or https`);
  }
  return url.toString();
};

class FooterPartnerService {
  getActivePartners() {
    return db.models.FooterPartner.findAll({
      where: { is_active: true },
      order: [["sort_order", "ASC"], ["id", "ASC"]],
    });
  }

  getAllPartners() {
    return db.models.FooterPartner.findAll({
      order: [["sort_order", "ASC"], ["id", "ASC"]],
    });
  }

  async createPartner(payload) {
    const lastPartner = await db.models.FooterPartner.findOne({
      order: [["sort_order", "DESC"]],
    });

    return db.models.FooterPartner.create({
      name: normalizeText(payload.name),
      image_url: assertHttpUrl(payload.image_url, "Image URL"),
      showcase_image_url: assertHttpUrl(
        payload.showcase_image_url,
        "Showcase image URL"
      ),
      target_url: assertHttpUrl(payload.target_url, "Target URL"),
      sort_order: lastPartner ? lastPartner.sort_order + 10 : 10,
      is_active: payload.is_active !== false,
    });
  }

  async updatePartner(id, payload) {
    const partner = await db.models.FooterPartner.findByPk(id);
    if (!partner) return null;

    const updates = {};
    if (payload.name !== undefined) updates.name = normalizeText(payload.name);
    if (payload.image_url !== undefined) {
      updates.image_url = assertHttpUrl(payload.image_url, "Image URL");
    }
    if (payload.showcase_image_url !== undefined) {
      updates.showcase_image_url = assertHttpUrl(
        payload.showcase_image_url,
        "Showcase image URL"
      );
    }
    if (payload.target_url !== undefined) {
      updates.target_url = assertHttpUrl(payload.target_url, "Target URL");
    }
    if (payload.is_active !== undefined) {
      updates.is_active = Boolean(payload.is_active);
    }

    await partner.update(updates);
    return partner;
  }

  async deletePartner(id) {
    const partner = await db.models.FooterPartner.findByPk(id);
    if (!partner) return false;
    await partner.destroy();
    return true;
  }

  async reorderPartners(ids) {
    const partnerIds = ids.map(Number);
    const uniqueIds = new Set(partnerIds);
    if (uniqueIds.size !== partnerIds.length || partnerIds.some(Number.isNaN)) {
      throw new Error("Invalid partner order");
    }

    return db.sequelize.transaction(async (transaction) => {
      const count = await db.models.FooterPartner.count({
        where: { id: partnerIds },
        transaction,
      });
      if (count !== partnerIds.length) throw new Error("Partner not found");

      await Promise.all(
        partnerIds.map((id, index) =>
          db.models.FooterPartner.update(
            { sort_order: (index + 1) * 10 },
            { where: { id }, transaction }
          )
        )
      );

      return db.models.FooterPartner.findAll({
        order: [["sort_order", "ASC"], ["id", "ASC"]],
        transaction,
      });
    });
  }
}

export default new FooterPartnerService();
