import db from "../models/index.js";

class CountryBestTimeToVisitService {
  getIncludeConfig() {
    return [
      {
        model: db.models.CountryBestTimeToVisitRegion,
        as: "regions",
        include: [
          {
            model: db.models.CountryBestTimeToVisitMonth,
            as: "months",
          },
        ],
      },
      {
        model: db.models.Country,
        as: "country",
        attributes: ["id", "name"],
      },
    ];
  }

  getOrderConfig() {
    return [
      [
        {
          model: db.models.CountryBestTimeToVisitRegion,
          as: "regions",
        },
        "sort_order",
        "ASC",
      ],
      [
        {
          model: db.models.CountryBestTimeToVisitRegion,
          as: "regions",
        },
        {
          model: db.models.CountryBestTimeToVisitMonth,
          as: "months",
        },
        "id",
        "ASC",
      ],
    ];
  }

  async getBySlug(slug) {
    try {
      const normalizedSlug = decodeURIComponent(slug).toLowerCase();

      const data = await db.models.CountryBestTimeToVisit.findOne({
        where: {
          slug: normalizedSlug,
          is_enabled: 1,
        },
        include: this.getIncludeConfig(),
        order: this.getOrderConfig(),
      });

      return data;
    } catch (error) {
      console.log("Country best time by slug error:", error);
      return null;
    }
  }

  async getByCountryId(countryId) {
    try {
      const data = await db.models.CountryBestTimeToVisit.findOne({
        where: {
          country_id: countryId,
          is_enabled: 1,
        },
        include: this.getIncludeConfig(),
        order: this.getOrderConfig(),
      });

      return data;
    } catch (error) {
      console.log("Country best time by country id error:", error);
      return null;
    }
  }
}

export default new CountryBestTimeToVisitService();