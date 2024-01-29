import db from "../models/index.js";

class CharacteristicService {
  async addCharacteristic(
    title,
    description,
    characteristic_icon_id,
    country_id
  ) {
    console.log(title, description, characteristic_icon_id, country_id);
    try {
      const characteristic = await db.models.Characteristic.create({
        title: title,
        description: description,
        characteristicIconId: characteristic_icon_id,
        countryId: country_id,
      });

      return characteristic;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

export default new CharacteristicService();
