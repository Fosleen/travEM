import { clearCache, getOrSetCache } from "../middleware/redis.js";
import service from "../services/footerService.js";

class FooterController {
  async getFooter(req, res) {
    try {
      const useCache = req.query.noCache !== "true";
      const cacheKey = `footer`;
      const response = await getOrSetCache(
        cacheKey,
        async () => {
          return await service.getFooter();
        },
        useCache
      );
      if (!response || response.length == 0) {
        res.status(404).json({ error: "No footer found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async patchFooter(req, res) {
    try {
      const response = await service.patchFooter(req.body.image_url);
      if (response === "Footer not found") {
        return res
          .status(404)
          .json({ error: "Footer with the provided ID doesn't exist" });
      } else {
        await clearCache(`footer`);
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new FooterController();
