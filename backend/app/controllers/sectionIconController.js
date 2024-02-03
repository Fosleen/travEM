import service from "../services/sectionIconService.js";

class SectionIconController {
  async getSectionIcons(req, res) {
    const response = await service.getSectionIcons();
    if (response == undefined) {
      res.status(404).json({ error: "No section icons found" });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new SectionIconController();
