import {
  clearCache,
  clearCacheByPattern,
  getOrSetCache,
} from "../middleware/redis.js";
import articleService from "../services/articleService.js";
import videoService from "../services/videoService.js";
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

class ArticleController {
  async getArticles(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 12;
      const articleType = parseInt(req.query.articleType) || null;
      const includeScheduled = canIncludeScheduledArticles(req);

      const response = await articleService.getArticles(
        page,
        pageSize,
        articleType,
        includeScheduled
      );

      if (!response || response.data.length === 0 || response.total === 0) {
        res.status(404).json({ error: "No articles found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getTipsFeaturedArticle(req, res) {
    try {
      const { articleTypeId } = req.params;

      const response = await articleService.getTipsFeaturedArticle(
        articleTypeId
      );

      if (!response) {
        res.status(404).json({ error: "No featured tips article found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getArticleBySearchTerm(req, res) {
    try {
      const { name } = req.params;
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 200;
      const includeScheduled = canIncludeScheduledArticles(req);

      const response = await articleService.getArticleBySearchTerm(
        name,
        page,
        pageSize,
        includeScheduled
      );

      if (!response || response.length == 0 || response.total === 0) {
        res.status(404).json({ error: `No article found by name ${name}` });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getArticleById(req, res) {
    try {
      const useCache = req.query.noCache !== "true";
      const { id } = req.params;
      const includeScheduled = canIncludeScheduledArticles(req);
      const cacheKey = includeScheduled ? `article:${id}:admin` : `article:${id}`;

      const response = await getOrSetCache(
        cacheKey,
        async () => {
          return await articleService.getArticleById(id, includeScheduled);
        },
        useCache
      );

      if (!response || response.length == 0) {
        res
          .status(404)
          .json({ error: `Article with the provided ID doesn't exist` });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error " + error });
    }
  }

  async addArticle(req, res) {
    try {
      const response = await articleService.addArticle(
        req.body.title,
        req.body.subtitle,
        req.body.description,
        req.body.main_image_url,
        req.body.date_written,
        req.body.date_updated,
        req.body.metatags,
        req.body.user_id,
        req.body.article_type_id,
        req.body.country_id,
        req.body.place_id,
        req.body.airport_city_id,
        req.body.is_far_destination,
        req.body.is_tips_featured,
        req.body.publish_at,
        req.body.publish_timezone,
        req.body.notify_subscribers_on_publish
      );

      if (response.length == 0) {
        res.status(400).json({ error: "Error inserting article" });
      } else {
        console.log(response.toJSON());

        let response2;
        if (req.body.video) {
          response2 = await videoService.addVideo(
            req.body.video,
            response.toJSON().id,
            null,
            null
          );
        } else {
          response2 = null;
        }

        if (response === undefined || response2 === undefined) {
          res.status(500).json({ error: "Internal server error" });
        } else {
          await clearCacheByPattern("continent-countries:*");
          res.status(200).json(response);
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getHomepageArticles(req, res) {
    const useCache = req.query.noCache !== "true";
    const includeScheduled = canIncludeScheduledArticles(req);
    const cacheKey = includeScheduled
      ? `homepage-articles:admin`
      : `homepage-articles`;

    const response = await getOrSetCache(
      cacheKey,
      async () => {
        return await articleService.getHomepageArticles(includeScheduled);
      },
      useCache
    );

    if (response.length == 0) {
      res.status(404).json({ error: "No articles for homepage found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getTopCountryArticle(req, res) {
    try {
      const { id } = req.params;
      const useCache = req.query.noCache !== "true";
      const cacheKey = `top-country-article:v2:${id}`;

      const response = await getOrSetCache(
        cacheKey,
        async () => {
          return await articleService.getTopCountryArticle(id);
        },
        useCache
      );

      if (!response || response.length == 0) {
        res.status(200).json({ error: "No top article found for country" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getArticlesByCountryId(req, res) {
    try {
      const { id } = req.params;
      const response = await articleService.getArticlesByCountryId(id);

      if (!response || response.length == 0) {
        res
          .status(404)
          .json({ error: `No articles for country with id ${id} found` });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getArticlesByPlaceId(req, res) {
    try {
      const { id } = req.params;
      const response = await articleService.getArticlesByPlaceId(id);

      if (!response || response.length == 0) {
        res
          .status(404)
          .json({ error: `No articles for place with id ${id} found` });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getRecommendedArticles(req, res) {
    try {
      const { id } = req.params;
      const { type } = req.query;
      const response = await articleService.getRecommendedArticles(id, type);

      if (response == "No starting article found") {
        res
          .status(404)
          .json({ error: `No recommended articles found for that id` });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateOrCreateTopCountryArticle(req, res) {
    try {
      const response = await articleService.updateOrCreateTopCountryArticle(
        req.body.article_id
      );

      if (response == "Article not found") {
        res
          .status(404)
          .json({ error: `Article with the provided ID doesn't exist` });
      } else if (response == "Article country not found") {
        res
          .status(404)
          .json({ error: `Article does not belong to any country` });
      } else if (!response || response.length == 0) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        await clearCache(`top-country-article:v2:${response.countryId}`);
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateOrCreateTopHomepageArticles(req, res) {
    const response = await articleService.updateOrCreateTopHomepageArticles(
      req.body.article_id,
      req.params.specialTypeId
    );

    if (response.length == 0) {
      res.status(500).json({ error: `No articles updated` });
    } else {
      await clearCache(`homepage-articles`);
      res.status(200).json(response);
    }
  }

  async patchArticle(req, res) {
    try {
      const response = await articleService.patchArticle(
        req.params.id,
        req.body.title,
        req.body.subtitle,
        req.body.description,
        req.body.metatags,
        req.body.main_image_url,
        req.body.date_written,
        req.body.date_updated,
        req.body.article_type_id,
        req.body.user_id,
        req.body.country_id,
        req.body.place_id,
        req.body.airport_city_id,
        req.body.is_far_destination,
        req.body.is_tips_featured,
        req.body.publish_at,
        req.body.publish_timezone,
        req.body.notify_subscribers_on_publish
      );

      if (response === "Article not found") {
        return res
          .status(404)
          .json({ error: "Article with the provided ID doesn't exist" });
      } else {
        await clearCache(`article:${req.params.id}`);
        await clearCache(`article:${req.params.id}:admin`);
        await clearCacheByPattern("continent-countries:*");
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteArticle(req, res) {
    try {
      const { id } = req.params;
      const response = await articleService.deleteArticle(id);

      if (response) {
        await clearCache(`article:${id}`);
        await clearCache(`article:${id}:admin`);
        await clearCacheByPattern("continent-countries:*");
        res.status(200).json({});
      } else {
        return res.status(500).json({ error: "Internal server error" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteTopCountryArticle(req, res) {
    try {
      const { id } = req.params;
      const response = await articleService.deleteTopCountryArticle(id);

      if (response) {
        await clearCache(`top-country-article:v2:${response}`);
        res.status(200).json({});
      } else {
        return res.status(500).json({ error: "Internal server error" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new ArticleController();
