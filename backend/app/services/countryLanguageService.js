import db from "../models/index.js";

class CountryLanguageService {
  getIncludeConfig() {
    return [
      {
        model: db.models.CountryLanguagePhrase,
        as: "phrases",
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
          model: db.models.CountryLanguagePhrase,
          as: "phrases",
        },
        "order_index",
        "ASC",
      ],
    ];
  }

  async getByCountryId(countryId) {
    try {
      const data = await db.models.CountryLanguage.findOne({
        where: {
          countryId,
          is_active: 1,
        },
        include: this.getIncludeConfig(),
        order: this.getOrderConfig(),
      });

      return data;
    } catch (error) {
      console.log("Country language by country id error:", error);
      return null;
    }
  }
}

export default new CountryLanguageService();