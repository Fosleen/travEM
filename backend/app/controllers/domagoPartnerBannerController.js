import { clearCache, getOrSetCache } from "../middleware/redis.js";
import service from "../services/domagoPartnerBannerService.js";

class DomagoPartnerBannerController {
  async get(req, res) {
    try {
      const config = await getOrSetCache("domago-partner-banner", () => service.get(), req.query.noCache !== "true");
      res.status(200).json(config);
    } catch (error) {
      console.error("Error fetching partner banner:", error);
      res.status(500).json({ error: "Error fetching partner banner" });
    }
  }
  async patch(req, res) {
    try {
      const config = await service.patch(req.body);
      await clearCache("domago-partner-banner");
      res.status(200).json(config);
    } catch (error) {
      console.error("Error updating partner banner:", error);
      res.status(500).json({ error: "Error updating partner banner" });
    }
  }
}
export default new DomagoPartnerBannerController();
