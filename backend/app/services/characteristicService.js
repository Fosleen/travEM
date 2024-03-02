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

  async patchCharacteristic(
    id,
    title,
    description,
    country_id,
    characteristic_icon_id
  ) {
    try {
      await db.models.Characteristic.update(
        {
          title: title,
          description: description,
          countryId: country_id,
          characteristicIconId: characteristic_icon_id,
        },
        {
          where: { id: id },
        }
      );

      const updatedCharacteristic = await db.models.Characteristic.findByPk(id);
      
      if (!updatedCharacteristic) {
        return "Characteristic not found";
      }

      return updatedCharacteristic;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new CharacteristicService();
