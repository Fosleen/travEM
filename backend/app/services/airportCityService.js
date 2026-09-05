import db from "../models/index.js";
const normalizeText = (value) => String(value || "").trim();

const normalizeUrl = (value, fieldName, required = false) => {
  const normalized = normalizeText(value);
  if (!normalized && !required) return null;
  if (!normalized) throw new Error(`${fieldName} is required`);
  const url = new URL(normalized);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`${fieldName} must use http or https`);
  }
  return url.toString();
};

class AirportCityService {
  getAirportCities(includeInactive = false) {
    return db.models.AirportCity.findAll({
      where: includeInactive ? undefined : { is_active: true },
      order: [["display_order", "ASC"], ["name", "ASC"]],
    });
  }

  async createAirportCity(payload) {
    const name = normalizeText(payload.name);
    if (await db.models.AirportCity.findOne({ where: { name } })) {
      throw new Error("An airport with this name already exists");
    }
    const last = await db.models.AirportCity.findOne({
      order: [["display_order", "DESC"]],
    });
    return db.models.AirportCity.create({
      name,
      flag_url: normalizeUrl(payload.flag_url, "Flag URL", true),
      banner_image_url: normalizeUrl(payload.banner_image_url, "Banner image URL", true),
      is_in_croatia: Boolean(payload.is_in_croatia),
      is_active: payload.is_active !== false,
      display_order:
        payload.display_order === undefined || payload.display_order === ""
          ? (last?.display_order || 0) + 10
          : Number(payload.display_order),
    });
  }

  async updateAirportCity(id, payload) {
    const airport = await db.models.AirportCity.findByPk(id);
    if (!airport) return null;
    const updates = {};
    if (payload.name !== undefined) updates.name = normalizeText(payload.name);
    if (payload.flag_url !== undefined) {
      updates.flag_url = normalizeUrl(payload.flag_url, "Flag URL", true);
    }
    if (payload.banner_image_url !== undefined) {
      updates.banner_image_url = normalizeUrl(payload.banner_image_url, "Banner image URL");
    }
    if (payload.is_in_croatia !== undefined) updates.is_in_croatia = Boolean(payload.is_in_croatia);
    if (payload.is_active !== undefined) updates.is_active = Boolean(payload.is_active);
    if (payload.display_order !== undefined) {
      const order = Number(payload.display_order);
      if (!Number.isInteger(order)) throw new Error("Display order must be an integer");
      updates.display_order = order;
    }
    await airport.update(updates);
    return airport;
  }
}

export default new AirportCityService();
