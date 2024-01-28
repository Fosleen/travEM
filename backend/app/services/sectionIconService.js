import db from "../models/index.js";

class SectionIconService {
  async getSectionIcons(id) {
    try {
      const sectionIcons = await db.models.SectionIcon.findAll();
      return sectionIcons;
    } catch (error) {
      return [];
    }
  }
}

export default new SectionIconService();
