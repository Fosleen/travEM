import db from "../models/index.js";

class CharacteristicIconService {
  async getCharacteristicIcons() {
    try {
      const characteristicIcons = await db.models.CharacteristicIcon.findAll();
      return characteristicIcons;
    } catch (error) {
      return [];
    }
  }
}

export default new CharacteristicIconService();
