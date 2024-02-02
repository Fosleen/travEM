import service from "../services/colorService.js";

class ColorController {
  async getColors(req, res) {
    const response = await service.getColors();
    if (response == undefined) {
      res.status(404).json({ error: "No colors found" });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new ColorController();
