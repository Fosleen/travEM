import {
  clearCache,
  clearCacheByPattern,
  getOrSetCache,
} from "../middleware/redis.js";
import service from "../services/countryService.js";

class CountriesController {
  async getCountries(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 200;
    const useCache = req.query.noCache !== "true";
    const cacheKey = `countries-page:${page}-size:${pageSize}`;
    const response = await getOrSetCache(
      cacheKey,
      async () => {
        return await service.getCountries(page, pageSize);
      },
      useCache
    );
    if (response == undefined) {
      res.status(404).json({ error: "No countries found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getCountryById(req, res) {
    const { id } = req.params;
    const useCache = req.query.noCache !== "true";
    const cacheKey = `country:${id}`;
    const response = await getOrSetCache(
      cacheKey,
      async () => {
        return await service.getCountryById(id);
      },
      useCache
    );
    if (!response || response.length == 0) {
      res.status(404).json({ error: `No country found by id ${id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async getCountryByName(req, res) {
    const { name } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 200;
    const isCount = req.query.isCount === "1";

    const useCache = req.query.noCache !== "true";
    const cacheKey = `country-name:${name}-page${page}-size:${pageSize}`;
    const response = await getOrSetCache(
      cacheKey,
      async () => {
        return await service.getCountryByName(name, page, pageSize, isCount);
      },
      useCache
    );

    if (!response || response.length == 0) {
      res.status(404).json({ error: `No country found by name ${name}` });
    } else {
      res.status(200).json(response);
    }
  }

  async getCountryByNameWithArticlesCount(req, res) {
    const { name } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 200;

    const response = await service.getCountryByNameWithArticlesCount(
      name,
      page,
      pageSize
    );
    if (!response || response.length == 0) {
      res
        .status(404)
        .json({ error: `No country with articles found by name ${name}` });
    } else {
      res.status(200).json(response);
    }
  }

  async getCountryPlaces(req, res) {
    const { id } = req.params;
    const useCache = req.query.noCache !== "true";
    const cacheKey = `country-places:${id}`;
    const response = await getOrSetCache(
      cacheKey,
      async () => {
        return await service.getCountryPlaces(id);
      },
      useCache
    );
    if (response == undefined) {
      res
        .status(404)
        .json({ error: `No places found for country with id ${id}}` });
    } else {
      res.status(200).json(response);
    }
  }

  async patchCountry(req, res) {
    const response = await service.patchCountry(
      req.params.id,
      req.body.name,
      req.body.description,
      req.body.main_image_url,
      req.body.flag_image_url,
      req.body.user_id,
      req.body.color_id,
      req.body.continent_id
    );
    if (response.length == 0) {
      res.status(500).json({ error: `Error updating country ${id}` });
    } else {
      await clearCache(`country-places:${req.params.id}`);
      await clearCache(`country:${req.params.id}`);
      await clearCacheByPattern(`country-name:${req.body.name}-page*`);
      res.status(200).json(response);
    }
  }

  async deleteCountry(req, res) {
    const { id } = req.params;
    const response = await service.deleteCountry(id);
    if (response) {
      await clearCache(`country:${id}`);
      await clearCache(`country-places:${id}`);
      res.status(200).json({});
    } else {
      res
        .status(500)
        .json({ error: `Error while deleting country with id ${id}` });
    }
  }

  async addCountry(req, res) {
    const response = await service.addCountry(
      req.body.name,
      req.body.description,
      req.body.main_image_url,
      req.body.flag_image_url,
      req.body.continent_id,
      req.body.color_id
    );

    console.log(response.toJSON());

    if (response == undefined) {
      res.status(500).json({ error: "Error inserting country" });
    } else {
      await clearCache(`homepage`);
      await clearCache(`continent-countries:${req.body.continent_id}`);
      await clearCacheByPattern("countries-page:*");
      res.status(200).json(response);
    }
  }
}

export default new CountriesController();
