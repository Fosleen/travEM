import db from "../models/index.js";

class ColorService {
  async getColors() {
    try {
      const colors = await db.models.Color.findAll();
      return colors;
    } catch (error) {
      return [];
    }
  }
}

export default new ColorService();
