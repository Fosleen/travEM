import service from "../services/characteristicIconService.js";

class CharacteristicIconController {
  async getCharacteristicIcons(req, res) {
    try {
      const response = await service.getCharacteristicIcons();
      if (!response || response.length == 0) {
        res.status(404).json({ error: "No characteristic icons found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new CharacteristicIconController();
