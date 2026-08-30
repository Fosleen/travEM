import db from "../models/index.js";
import { sendEmail } from "./emailService.js";
import { moderateComment } from "../utils/commentModeration.js";

const OPEN_INQUIRY_LABEL = "Složimo vaš medeni mjesec zajedno - slobodan upit";
const clean = (value, max = 1000) => value?.toString().trim().slice(0, max) || null;
const isPlausibleName = (value) => {
  const name = (clean(value, 80) || "").replace(/\s+/g, " ");
  if (name.length < 2 || !/^[\p{L}][\p{L}\p{M}'’ -]*[\p{L}\p{M}]$/u.test(name) || /(.)\1\1/iu.test(name)) return false;
  const compact = name.normalize("NFD").replace(/[\u0300-\u036f'’ -]/g, "").toLowerCase();
  if (/(?:asdf|qwer|zxcv|dfgdfg|abcabc|testtest)/.test(compact)) return false;
  return compact.length <= 3 || /[aeiouy]/.test(compact);
};
const hasGibberishEmailLocalPart = (email = "") => {
  const localPart = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  return /^(.{2,5})\1{1,}$/.test(localPart) || /(.)\1{3,}/.test(localPart) || /(?:asdf|qwer|zxcv|dfgdfg|abcabc|testtest)/.test(localPart);
};
const escapeHtml = (value) =>
  (value || "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const normalizeImages = (images = []) =>
  images
    .map((image) => clean(typeof image === "string" ? image : image.image_url, 2000))
    .filter((url) => {
      try {
        return ["http:", "https:"].includes(new URL(url).protocol);
      } catch {
        return false;
      }
    });

const programInclude = [{ model: db.models.HoneymoonProgramImage, as: "images" }];

class HoneymoonService {
  async getSettings() {
    const [settings] = await db.models.HoneymoonSetting.findOrCreate({ where: { id: 1 }, defaults: { id: 1, hero_image_url: null } });
    return settings;
  }

  async updateSettings(data) {
    const heroImageUrl = clean(data.hero_image_url, 2000);
    if (heroImageUrl) {
      try {
        if (!["http:", "https:"].includes(new URL(heroImageUrl).protocol)) throw new Error();
      } catch {
        return { error: "Unesite ispravan HTTP ili HTTPS URL naslovne fotografije." };
      }
    }
    const [settings] = await db.models.HoneymoonSetting.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
    await settings.update({ hero_image_url: heroImageUrl });
    return settings;
  }

  async getPrograms(admin = false) {
    return db.models.HoneymoonProgram.findAll({
      where: admin ? undefined : { is_active: true },
      include: programInclude,
      order: [["display_order", "ASC"], ["id", "ASC"], [{ model: db.models.HoneymoonProgramImage, as: "images" }, "display_order", "ASC"]],
    });
  }

  validateProgram(data) {
    const name = clean(data.name, 160);
    const description = clean(data.description, 5000);
    const price = data.price_from === "" || data.price_from == null ? null : Number(data.price_from);
    if (!name || !description) return { error: "Naziv i opis ideje putovanja su obavezni." };
    if (price !== null && (!Number.isFinite(price) || price < 0)) return { error: "Procijenjeni troškovi putovanja nisu ispravni." };
    return {
      payload: {
        name,
        description,
        destination: clean(data.destination, 160),
        duration: clean(data.duration, 80),
        price_from: price,
        display_order: Number.isInteger(Number(data.display_order)) ? Number(data.display_order) : 0,
        is_active: data.is_active !== false,
      },
      images: normalizeImages(data.images),
    };
  }

  async createProgram(data) {
    const validated = this.validateProgram(data);
    if (validated.error) return validated;
    return db.sequelize.transaction(async (transaction) => {
      const program = await db.models.HoneymoonProgram.create(validated.payload, { transaction });
      await db.models.HoneymoonProgramImage.bulkCreate(
        validated.images.map((image_url, display_order) => ({ image_url, display_order, honeymoonProgramId: program.id })),
        { transaction }
      );
      return this.getProgram(program.id, transaction);
    });
  }

  getProgram(id, transaction) {
    return db.models.HoneymoonProgram.findByPk(id, { include: programInclude, transaction });
  }

  async updateProgram(id, data) {
    const validated = this.validateProgram(data);
    if (validated.error) return validated;
    return db.sequelize.transaction(async (transaction) => {
      const program = await db.models.HoneymoonProgram.findByPk(id, { transaction });
      if (!program) return { error: "Ideja putovanja nije pronađena.", statusCode: 404 };
      await program.update(validated.payload, { transaction });
      await db.models.HoneymoonProgramImage.destroy({ where: { honeymoonProgramId: id }, transaction });
      await db.models.HoneymoonProgramImage.bulkCreate(
        validated.images.map((image_url, display_order) => ({ image_url, display_order, honeymoonProgramId: id })),
        { transaction }
      );
      return this.getProgram(id, transaction);
    });
  }

  async deleteProgram(id) {
    const count = await db.models.HoneymoonProgram.destroy({ where: { id } });
    return count ? { success: true } : { error: "Ideja putovanja nije pronađena.", statusCode: 404 };
  }

  validateInquiry(data) {
    if (clean(data.website)) return { spam: true };
    const payload = {
      first_name: clean(data.first_name, 80),
      last_name: clean(data.last_name, 80),
      email: clean(data.email, 200)?.toLowerCase(),
      phone: clean(data.phone, 50),
      approximate_date: clean(data.approximate_date, 10),
      traveler_count: Number(data.traveler_count),
      estimated_budget: clean(data.estimated_budget, 100),
      preferred_destinations: clean(data.preferred_destinations, 500),
      departure_airport: clean(data.departure_airport, 160),
      message: clean(data.message, 3000),
      honeymoonProgramId: data.program_id ? Number(data.program_id) : null,
      is_open_inquiry: data.selection === "open",
    };
    if (!isPlausibleName(payload.first_name) || (payload.last_name && !isPlausibleName(payload.last_name)))
      return { error: "Unesite ispravno ime i prezime, ako ga navodite." };
    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) || hasGibberishEmailLocalPart(payload.email))
      return { error: "Unesite ispravnu email adresu." };
    if (!Number.isInteger(payload.traveler_count) || payload.traveler_count < 1 || payload.traveler_count > 100)
      return { error: "Unesite ispravan broj putnika." };
    if (!data.privacy_accepted) return { error: "Za slanje upita potrebno je prihvatiti pravila privatnosti." };
    if (!payload.is_open_inquiry && !payload.honeymoonProgramId) return { error: "Odaberite ideju putovanja ili slobodan upit." };
    const moderation = moderateComment({
      username: [payload.first_name, payload.last_name].filter(Boolean).join(" "),
      email: payload.email,
      body: [payload.message, payload.preferred_destinations, payload.departure_airport].filter(Boolean).join(" ") || "upit za medeni mjesec",
    });
    if (moderation.status !== "published") return { error: "Upit sadrži nedopušten ili neispravan sadržaj." };
    return { payload };
  }

  async createInquiry(data) {
    const validated = this.validateInquiry(data);
    if (validated.spam) return { success: true };
    if (validated.error) return validated;
    const payload = validated.payload;
    let program = null;
    if (!payload.is_open_inquiry) {
      program = await db.models.HoneymoonProgram.findOne({ where: { id: payload.honeymoonProgramId, is_active: true } });
      if (!program) return { error: "Odabrana ideja putovanja više nije dostupna." };
    }
    payload.program_name = program?.name || OPEN_INQUIRY_LABEL;
    payload.privacy_accepted_at = new Date();
    const fullName = [payload.first_name, payload.last_name].filter(Boolean).join(" ");

    const rows = [
      ["Ime i prezime", fullName], ["Email", payload.email],
      ["Telefon", payload.phone], ["Ideja putovanja", payload.program_name], ["Broj putnika", payload.traveler_count],
      ["Okvirni datum", payload.approximate_date], ["Budžet", payload.estimated_budget],
      ["Željene destinacije", payload.preferred_destinations], ["Polazni aerodrom", payload.departure_airport],
      ["Poruka", payload.message],
    ].filter(([, value]) => value);
    const html = `<h2>Novi upit za organizaciju medenog mjeseca</h2><table>${rows
      .map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`)
      .join("")}</table>`;
    const inquiryRecipient =
      process.env.HONEYMOON_INQUIRY_EMAIL ||
      process.env.FORM_INQUIRY_EMAIL ||
      "travem.hr@gmail.com";
    await sendEmail(
      inquiryRecipient,
      `Upit za medeni mjesec: ${fullName}`,
      html,
      { replyTo: payload.email }
    );
    return db.models.HoneymoonInquiry.create(payload);
  }

  getInquiries() {
    return db.models.HoneymoonInquiry.findAll({ order: [["createdAt", "DESC"]] });
  }

  async dismissInquiry(id) {
    const count = await db.models.HoneymoonInquiry.destroy({ where: { id } });
    return count ? { success: true } : { error: "Upit nije pronađen.", statusCode: 404 };
  }
}

export default new HoneymoonService();
