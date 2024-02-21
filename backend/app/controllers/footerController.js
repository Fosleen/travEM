import service from "../services/footerService.js";

class FooterController {
  async getFooter(req, res) {
    const response = await service.getFooter();
    if (response == undefined) {
      res.status(404).json({ error: "No footer found" });
    } else {
      res.status(200).json(response);
    }
  }

  async patchFooter(req, res) {
    const response = await service.patchFooter(req.body.image_url);
    if (response == undefined) {
      res.status(500).json({ error: "Error updating footer" });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new FooterController();
