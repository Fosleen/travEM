import service from "../services/homepageService.js";

class HomepageController {
  async getHomepage(req, res) {
    try {
      const response = await service.getHomepage();
      if (response == undefined) {
        res.status(404).json({ error: "No homepage found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getHomepageStats(req, res) {
    try {
      const response = await service.getHomepageStats();
      if (response == undefined) {
        res.status(404).json({ error: "No homepage stats found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async patchHomepage(req, res) {
    const response = await service.patchHomepage(
      req.body.hero_image_url,
      req.body.banner_title,
      req.body.banner_small_text,
      req.body.banner_description,
      req.body.button_text,
      req.body.flights_nmbr,
      req.body.videos_nmbr,
      req.body.distance_nmbr,
      req.body.banner_image_url,
      req.body.button_url
    );
    if (response == undefined) {
      res.status(500).json({ error: "Error updating homepage" });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new HomepageController();
