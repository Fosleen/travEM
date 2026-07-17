import db from "../models/index.js";
import { MONTH_ORDER } from "../utils/global.js";

const BEST_TIME_INCLUDE = [
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
];

const sortMonths = (data) => {
  if (!data) {
    return null;
  }

  const plainData = data.toJSON ? data.toJSON() : data;

  plainData.months = [...(plainData.months || [])].sort(
    (a, b) =>
      MONTH_ORDER.indexOf(a.month_key) - MONTH_ORDER.indexOf(b.month_key)
  );

  return plainData;
};

class PlaceBestTimeToVisitService {
  async getBySlug(slug) {
    try {
      const normalizedSlug = decodeURIComponent(slug).toLowerCase();

      const data = await db.models.PlaceBestTimeToVisit.findOne({
        where: {
          slug: normalizedSlug,
          is_enabled: 1,
        },
        include: BEST_TIME_INCLUDE,
      });

      return sortMonths(data);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getByPlaceId(placeId) {
    try {
      const data = await db.models.PlaceBestTimeToVisit.findOne({
        where: {
          place_id: placeId,
          is_enabled: 1,
        },
        include: BEST_TIME_INCLUDE,
      });

      return sortMonths(data);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new PlaceBestTimeToVisitService();