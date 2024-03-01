import service from "../services/colorService.js";

class ColorController {
  async getColors(req, res) {
    try {
      const response = await service.getColors();
      if (response.length == 0) {
        res.status(404).json({ error: "No colors found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new ColorController();
