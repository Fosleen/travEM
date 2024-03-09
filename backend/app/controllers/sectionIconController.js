import service from "../services/sectionIconService.js";

class SectionIconController {
  async getSectionIcons(req, res) {
    try {
      const response = await service.getSectionIcons();
      if (!response || response.length == 0) {
        res.status(404).json({ error: "No section icons found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new SectionIconController();
