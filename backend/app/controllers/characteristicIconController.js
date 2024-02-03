import service from "../services/characteristicIconService.js";

class CharacteristicIconController {
  async getCharacteristicIcons(req, res) {
    const response = await service.getCharacteristicIcons();
    if (response == undefined) {
      res.status(404).json({ error: "No characteristic icons found" });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new CharacteristicIconController();
