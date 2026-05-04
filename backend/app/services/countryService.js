import db from "../models/index.js";
import { Op } from "sequelize";

const MONTH_ORDER = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const normalizeNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  return Number(value.toString().replace(",", "."));
};

const normalizeSlug = (value) => {
  return value?.toString().trim().toLowerCase();
};

class CountriesService {
  async getCountries(page, pageSize) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    try {
      const visitedCountries = await db.models.Country.findAndCountAll({
        limit: limit,
        offset: offset,
      });

      const countriesWithArticleCount = await Promise.all(
        visitedCountries.rows.map(async (country) => {
          const articleCount = await db.models.Article.count({
            where: { countryId: country.id },
          });

          return {
            ...country.toJSON(),
            articleCount,
          };
        })
      );

      return {
        total: visitedCountries.count,
        totalPages: Math.ceil(visitedCountries.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        data: countriesWithArticleCount,
      };
    } catch (error) {
      return [];
    }
  }

  async getCountryById(id) {
    try {
      const country = await db.models.Country.findByPk(id, {
        include: [
          {
            model: db.models.VisaInfo,
          },
          {
            model: db.models.Color,
          },
          {
            model: db.models.Continent,
          },
          {
            model: db.models.Specificity,
            include: [
              {
                model: db.models.SpecificityImage,
              },
              {
                model: db.models.SpecificityItem,
              },
            ],
          },
          {
            model: db.models.Place,
          },
          {
            model: db.models.Video,
          },
          {
            model: db.models.Characteristic,
            include: [
              {
                model: db.models.CharacteristicIcon,
              },
            ],
          },
          {
            model: db.models.Article,
            limit: 8,
          },
          {
            model: db.models.CountryBestTimeToVisit,
            as: "best_time_to_visit",
            include: [
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
            ],
          },
        ],
        order: [
          [
            {
              model: db.models.CountryBestTimeToVisit,
              as: "best_time_to_visit",
            },
            {
              model: db.models.CountryBestTimeToVisitRegion,
              as: "regions",
            },
            "sort_order",
            "ASC",
          ],
          [
            {
              model: db.models.CountryBestTimeToVisit,
              as: "best_time_to_visit",
            },
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
        ],
      });

      return country;
    } catch (error) {
      console.log(error);
      return `not found country with PK ${id}`;
    }
  }

  async getCountryByName(name, page, pageSize, isCount) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    try {
      const countries = await db.models.Country.findAndCountAll({
        limit: limit,
        offset: offset,
        where: {
          name: {
            [Op.startsWith]: name,
          },
        },
      });

      if (isCount) {
        const countriesWithArticleCount = await Promise.all(
          countries.rows.map(async (country) => {
            const articleCount = await db.models.Article.count({
              where: { countryId: country.id },
            });

            return {
              ...country.toJSON(),
              articleCount,
            };
          })
        );

        return {
          total: countries.count,
          totalPages: Math.ceil(countries.count / pageSize),
          currentPage: page,
          pageSize: pageSize,
          data: countriesWithArticleCount,
        };
      } else {
        return {
          total: countries.count,
          totalPages: Math.ceil(countries.count / pageSize),
          currentPage: page,
          pageSize: pageSize,
          data: countries.rows,
        };
      }
    } catch (error) {
      console.log(error);
      return `not found countries starting with name ${name}`;
    }
  }

  async getCountryPlaces(id) {
    try {
      const countryPlaces = await db.models.Place.findAll({
        where: { country_id: id },
      });

      return countryPlaces;
    } catch (error) {
      return [];
    }
  }

  async upsertBestTimeToVisit(countryId, countryName, bestTimeToVisit) {
    if (!bestTimeToVisit) return null;

    const regions = bestTimeToVisit.regions || [];

    const normalizedRegions = regions.filter(
      (region) =>
        region &&
        region.region_key &&
        region.label &&
        Array.isArray(region.months) &&
        region.months.length > 0
    );

    if (normalizedRegions.length === 0) return null;

    const slug =
      normalizeSlug(bestTimeToVisit.slug) || normalizeSlug(countryName);

    const [bestTimeRecord] =
      await db.models.CountryBestTimeToVisit.findOrCreate({
        where: {
          country_id: countryId,
        },
        defaults: {
          country_id: countryId,
          slug,
          title:
            bestTimeToVisit.title ||
            `Najbolje vrijeme za posjet ${countryName}`,
          subtitle: bestTimeToVisit.subtitle || null,
          is_enabled:
            bestTimeToVisit.is_enabled === undefined
              ? true
              : Boolean(bestTimeToVisit.is_enabled),
        },
      });

    await bestTimeRecord.update({
      slug,
      title:
        bestTimeToVisit.title || `Najbolje vrijeme za posjet ${countryName}`,
      subtitle: bestTimeToVisit.subtitle || null,
      is_enabled:
        bestTimeToVisit.is_enabled === undefined
          ? true
          : Boolean(bestTimeToVisit.is_enabled),
    });

    await db.models.CountryBestTimeToVisitMonth.destroy({
      where: {
        country_best_time_to_visit_region_id: {
          [Op.in]: db.sequelize.literal(
            `(SELECT id FROM country_best_time_to_visit_region WHERE country_best_time_to_visit_id = ${bestTimeRecord.id})`
          ),
        },
      },
    });

    await db.models.CountryBestTimeToVisitRegion.destroy({
      where: {
        country_best_time_to_visit_id: bestTimeRecord.id,
      },
    });

    for (const [regionIndex, region] of normalizedRegions.entries()) {
      const createdRegion = await db.models.CountryBestTimeToVisitRegion.create(
        {
          country_best_time_to_visit_id: bestTimeRecord.id,
          region_key: normalizeSlug(region.region_key),
          label: region.label,
          note: region.note || null,
          sort_order: region.sort_order || regionIndex + 1,
        }
      );

      const monthsToCreate = MONTH_ORDER.map((monthKey) => {
        const foundMonth = region.months.find(
          (month) => month.month_key === monthKey
        );

        return {
          country_best_time_to_visit_region_id: createdRegion.id,
          month_key: monthKey,
          avg_temp_c: normalizeNumber(foundMonth?.avg_temp_c),
          avg_rain_mm: normalizeNumber(foundMonth?.avg_rain_mm),
        };
      }).filter(
        (month) =>
          month.avg_temp_c !== null &&
          month.avg_rain_mm !== null &&
          !Number.isNaN(month.avg_temp_c) &&
          !Number.isNaN(month.avg_rain_mm)
      );

      if (monthsToCreate.length > 0) {
        await db.models.CountryBestTimeToVisitMonth.bulkCreate(monthsToCreate);
      }
    }

    return bestTimeRecord;
  }

  async patchCountry(
    id,
    name,
    description,
    main_image_url,
    flag_image_url,
    user_id,
    color_id,
    continent_id,
    best_time_to_visit
  ) {
    try {
      await db.models.Country.update(
        {
          name: name,
          description: description,
          main_image_url: main_image_url,
          flag_image_url: flag_image_url,
          userId: user_id,
          colorId: color_id,
          continentId: continent_id,
        },
        {
          where: { id: id },
        }
      );

      await this.upsertBestTimeToVisit(id, name, best_time_to_visit);

      const updatedCountry = await db.models.Country.findByPk(id, {
        include: [
          {
            model: db.models.CountryBestTimeToVisit,
            as: "best_time_to_visit",
            include: [
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
            ],
          },
        ],
      });

      return updatedCountry;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteCountry(id) {
    try {
      const bestTime = await db.models.CountryBestTimeToVisit.findOne({
        where: {
          country_id: id,
        },
        include: [
          {
            model: db.models.CountryBestTimeToVisitRegion,
            as: "regions",
          },
        ],
      });

      if (bestTime?.regions?.length > 0) {
        await db.models.CountryBestTimeToVisitMonth.destroy({
          where: {
            country_best_time_to_visit_region_id: {
              [Op.in]: bestTime.regions.map((region) => region.id),
            },
          },
        });

        await db.models.CountryBestTimeToVisitRegion.destroy({
          where: {
            country_best_time_to_visit_id: bestTime.id,
          },
        });

        await db.models.CountryBestTimeToVisit.destroy({
          where: {
            id: bestTime.id,
          },
        });
      }

      await db.models.Country.destroy({
        where: { id: id },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addCountry(
    name,
    description,
    main_image_url,
    flag_image_url,
    continent_id,
    color_id,
    best_time_to_visit
  ) {
    try {
      const country = await db.models.Country.create({
        name: name,
        description: description,
        main_image_url: main_image_url,
        flag_image_url: flag_image_url,
        continentId: continent_id,
        colorId: color_id,
      });

      await this.upsertBestTimeToVisit(country.id, name, best_time_to_visit);

      const createdCountry = await db.models.Country.findByPk(country.id, {
        include: [
          {
            model: db.models.CountryBestTimeToVisit,
            as: "best_time_to_visit",
            include: [
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
            ],
          },
        ],
      });

      return createdCountry;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

export default new CountriesService();