import { clearCache, getOrSetCache } from "../middleware/redis.js";
import service from "../services/homepageService.js";
import { isHeroImageCrop } from "../utils/heroImageCrop.js";

class HomepageController {
  async getHomepage(req, res) {
    try {
      const useCache = req.query.noCache !== "true";
      const cacheKey = `homepage`;
      const response = await getOrSetCache(
        cacheKey,
        async () => {
          return await service.getHomepage();
        },
        useCache
      );
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
      const useCache = req.query.noCache !== "true";
      const cacheKey = `homepage-stats`;
      const response = await getOrSetCache(
        cacheKey,
        async () => {
          return await service.getHomepageStats();
        },
        useCache
      );
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
    const { hero_image_url, hero_image_crop } = req.body;
    if (hero_image_crop !== undefined &&
        (typeof hero_image_url !== "string" || !hero_image_url.trim() || !isHeroImageCrop(hero_image_crop))) {
      return res.status(400).json({ error: "Invalid hero image crop" });
    }

    const crop = hero_image_crop == null ? null : {
      desktop: { x: hero_image_crop.desktop.x, y: hero_image_crop.desktop.y, zoom: hero_image_crop.desktop.zoom },
      mobile: { x: hero_image_crop.mobile.x, y: hero_image_crop.mobile.y, zoom: hero_image_crop.mobile.zoom },
    };
    const response = await service.patchHomepage(
      hero_image_url,
      req.body.banner_title,
      req.body.banner_small_text,
      req.body.banner_description,
      req.body.button_text,
      req.body.flights_nmbr,
      req.body.videos_nmbr,
      req.body.distance_nmbr,
      req.body.banner_image_url,
      req.body.button_url,
      hero_image_url === undefined ? undefined : crop
    );
    if (response == undefined) {
      res.status(500).json({ error: "Error updating homepage" });
    } else {
      await clearCache(`homepage`);
      await clearCache(`homepage-stats`);
      res.status(200).json(response);
    }
  }
}

export default new HomepageController();
