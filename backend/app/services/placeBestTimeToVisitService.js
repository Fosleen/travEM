import db from "../models/index.js";

class PlaceBestTimeToVisitService {
  async getBySlug(slug) {
    try {
      const normalizedSlug = decodeURIComponent(slug).toLowerCase();

      const data = await db.models.PlaceBestTimeToVisit.findOne({
        where: {
          slug: normalizedSlug,
          is_enabled: 1,
        },
        include: [
          {
            model: db.models.PlaceBestTimeToVisitMonth,
            as: "months",
          },
          {
            model: db.models.Place,
            as: "place",
            attributes: [
              "id",
              "name",
              "name_genitive",
              "name_dative",
              "name_accusative",
              "name_locative",
            ],
          },
        ],
        order: [
          [
            {
              model: db.models.PlaceBestTimeToVisitMonth,
              as: "months",
            },
            "id",
            "ASC",
          ],
        ],
      });

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new PlaceBestTimeToVisitService();