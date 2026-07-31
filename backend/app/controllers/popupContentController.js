import { clearCache, getOrSetCache } from "../middleware/redis.js";
import service from "../services/popupContentService.js";

class PopupContentController {
  async getPopupContent(req, res) {
    try {
      const useCache = req.query.noCache !== "true";
      const response = await getOrSetCache(
        "popup-content",
        () => service.getPopupContent(),
        useCache
      );

      if (!response) {
        return res.status(404).json({ error: "Popup content not found" });
      }

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async patchPopupContent(req, res) {
    try {
      const imageUrl = req.body.image_url?.trim();

      if (!imageUrl) {
        return res.status(400).json({ error: "image_url is required" });
      }

      const response = await service.patchPopupContent(imageUrl);

      if (!response) {
        return res.status(404).json({ error: "Popup content not found" });
      }

      await clearCache("popup-content");
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new PopupContentController();
