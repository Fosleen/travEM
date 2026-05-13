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

  async getByCountryId(countryId, includeInactive = false) {
    try {
      const whereConfig = {
        countryId,
      };

      if (!includeInactive) {
        whereConfig.is_active = 1;
      }

      const data = await db.models.CountryLanguage.findOne({
        where: whereConfig,
        include: this.getIncludeConfig(),
        order: this.getOrderConfig(),
      });

      return data;
    } catch (error) {
      console.log("Country language by country id error:", error);
      return null;
    }
  }

  async add(data) {
    const transaction = await db.sequelize.transaction();

    try {
      const { countryId, language_name, is_active, phrases } = data;

      const existingLanguage = await db.models.CountryLanguage.findOne({
        where: {
          countryId,
        },
        transaction,
      });

      if (existingLanguage) {
        await transaction.rollback();
        return {
          error: "Language data already exists for this country.",
        };
      }

      const countryLanguage = await db.models.CountryLanguage.create(
        {
          countryId,
          language_name,
          is_active,
        },
        { transaction }
      );

      if (phrases && phrases.length > 0) {
        const preparedPhrases = phrases.map((phraseItem) => ({
          countryLanguageId: countryLanguage.id,
          order_index: phraseItem.order_index,
          phrase: phraseItem.phrase,
          pronunciation: phraseItem.pronunciation || null,
        }));

        await db.models.CountryLanguagePhrase.bulkCreate(preparedPhrases, {
          transaction,
        });
      }

      await transaction.commit();

      return await db.models.CountryLanguage.findOne({
        where: {
          id: countryLanguage.id,
        },
        include: this.getIncludeConfig(),
        order: this.getOrderConfig(),
      });
    } catch (error) {
      await transaction.rollback();
      console.log("Add country language error:", error);
      return null;
    }
  }

  async patch(id, data) {
    const transaction = await db.sequelize.transaction();

    try {
      const { language_name, is_active, phrases } = data;

      const countryLanguage = await db.models.CountryLanguage.findOne({
        where: {
          id,
        },
        transaction,
      });

      if (!countryLanguage) {
        await transaction.rollback();
        return {
          error: "Country language data not found.",
        };
      }

      await countryLanguage.update(
        {
          language_name,
          is_active,
        },
        { transaction }
      );

      await db.models.CountryLanguagePhrase.destroy({
        where: {
          countryLanguageId: id,
        },
        transaction,
      });

      if (phrases && phrases.length > 0) {
        const preparedPhrases = phrases.map((phraseItem) => ({
          countryLanguageId: id,
          order_index: phraseItem.order_index,
          phrase: phraseItem.phrase,
          pronunciation: phraseItem.pronunciation || null,
        }));

        await db.models.CountryLanguagePhrase.bulkCreate(preparedPhrases, {
          transaction,
        });
      }

      await transaction.commit();

      return await db.models.CountryLanguage.findOne({
        where: {
          id,
        },
        include: this.getIncludeConfig(),
        order: this.getOrderConfig(),
      });
    } catch (error) {
      await transaction.rollback();
      console.log("Patch country language error:", error);
      return null;
    }
  }
}

export default new CountryLanguageService();