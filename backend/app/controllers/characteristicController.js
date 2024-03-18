import service from "../services/characteristicService.js";

class CharacteristicController {
  async addCharacteristic(req, res) {
    try {
      const response = await service.addCharacteristic(
        req.body.title,
        req.body.description,
        req.body.characteristic_icon_id,
        req.body.country_id
      );
      if (!response || response.length == 0) {
        res.status(400).json({ error: "Error inserting characteristic" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async patchCharacteristic(req, res) {
    try {
      const response = await service.patchCharacteristic(
        req.params.id,
        req.body.title,
        req.body.description,
        req.body.country_id,
        req.body.characteristic_icon_id
      );
      if (response === "Characteristic not found") {
        return res
          .status(404)
          .json({ error: "Characteristic with the provided ID doesn't exist" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new CharacteristicController();
