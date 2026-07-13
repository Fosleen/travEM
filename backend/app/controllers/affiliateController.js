import affiliateService from "../services/affiliateService.js";

class AffiliateController {
  async getPartners(_req, res) {
    try {
      res.json(await affiliateService.getPartners());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addPartner(req, res) {
    try {
      if (!req.body.name || !req.body.label || !req.body.default_url || !req.body.icon_url) {
        return res.status(400).json({ error: "Name, label, URL and icon are required" });
      }
      res.status(201).json(await affiliateService.addPartner(req.body));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updatePartner(req, res) {
    try {
      const partner = await affiliateService.updatePartner(
        req.params.id,
        req.body
      );
      if (!partner) {
        return res.status(404).json({ error: "Affiliate partner not found" });
      }
      res.json(partner);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async syncArticleLinks(req, res) {
    try {
      const links = await affiliateService.syncArticleLinks(req.params.articleId, req.body.links);
      if (!links) return res.status(404).json({ error: "Article not found" });
      res.json(links);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AffiliateController();
