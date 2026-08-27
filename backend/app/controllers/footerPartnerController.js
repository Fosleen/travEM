import { clearCache, getOrSetCache } from "../middleware/redis.js";
import service from "../services/footerPartnerService.js";

const clearPartnerCache = () => clearCache("footer-partners");

class FooterPartnerController {
  async getActivePartners(_req, res) {
    try {
      const partners = await getOrSetCache(
        "footer-partners",
        () => service.getActivePartners()
      );
      return res.status(200).json(partners);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllPartners(_req, res) {
    try {
      return res.status(200).json(await service.getAllPartners());
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async createPartner(req, res) {
    try {
      if (
        !req.body.name?.trim() ||
        !req.body.image_url ||
        !req.body.showcase_image_url ||
        !req.body.target_url
      ) {
        return res.status(400).json({
          error:
            "Name, footer image URL, showcase image URL and target URL are required",
        });
      }
      const partner = await service.createPartner(req.body);
      await clearPartnerCache();
      return res.status(201).json(partner);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updatePartner(req, res) {
    try {
      const partner = await service.updatePartner(req.params.id, req.body);
      if (!partner) return res.status(404).json({ error: "Footer partner not found" });
      await clearPartnerCache();
      return res.status(200).json(partner);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deletePartner(req, res) {
    try {
      if (!(await service.deletePartner(req.params.id))) {
        return res.status(404).json({ error: "Footer partner not found" });
      }
      await clearPartnerCache();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async reorderPartners(req, res) {
    try {
      if (!Array.isArray(req.body.ids)) {
        return res.status(400).json({ error: "ids must be an array" });
      }
      const partners = await service.reorderPartners(req.body.ids);
      await clearPartnerCache();
      return res.status(200).json(partners);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new FooterPartnerController();
