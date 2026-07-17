import { clearCache, getOrSetCache } from "../middleware/redis.js";
import service from "../services/airplaneTicketPromoService.js";
import jwt from "jsonwebtoken";

const canIncludeScheduledArticles = (req) => {
  if (req.query.includeScheduled !== "true") {
    return false;
  }

  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  try {
    jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

class AirplaneTicketPromoController {
  async getPromo(req, res) {
    try {
      const useCache = req.query.noCache !== "true";
      const includeScheduled = canIncludeScheduledArticles(req);
      const cacheKey = includeScheduled
        ? "airplane-ticket-promo:admin"
        : "airplane-ticket-promo";

      const response = await getOrSetCache(
        cacheKey,
        async () => {
          return await service.getPromo(includeScheduled);
        },
        useCache
      );

      if (!response) {
        res.status(404).json({ error: "No airplane ticket promo found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async patchPromo(req, res) {
    const response = await service.patchPromo(
      req.body.top_text,
      req.body.middle_text,
      req.body.button_text,
      req.body.article_id
    );

    if (response === "Article not found") {
      res.status(404).json({ error: "Article with the provided ID not found" });
    } else if (!response) {
      res.status(500).json({ error: "Error updating airplane ticket promo" });
    } else {
      await clearCache("airplane-ticket-promo");
      await clearCache("airplane-ticket-promo:admin");
      res.status(200).json(response);
    }
  }
}

export default new AirplaneTicketPromoController();
