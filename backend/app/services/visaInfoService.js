import db from "../models/index.js";

class VisaInfoService {
  async addVisaInfo(
    id_country_info,
    documentation,
    visa_needed,
    additional_info,
    country_id
  ) {
    try {
      const visaInfo = await db.models.VisaInfo.create({
        id_country_info: id_country_info,
        documentation: documentation,
        visa_needed: visa_needed,
        additional_info: additional_info,
        countryId: country_id,
      });

      return visaInfo;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getVisaInfoById(id) {
    try {
      const visaInfo = await db.models.VisaInfo.findByPk(id);
      return visaInfo;
    } catch (error) {
      console.log(error);
      return `not found visa info with PK ${id}`;
    }
  }

  async getVisaInfoByCountries(country1, country2) {
    try {
      const info = await db.models.VisaInfo.findOne({
        where: {
          countryId: country1,
          id_country_info: country2,
        },
      });
      return info ? info : true; // true = no data about these countries yet
    } catch (error) {
      return [];
    }
  }

  async patchVisaInfo(
    id,
    id_country_info,
    documentation,
    visa_needed,
    additional_info,
    country_id
  ) {
    try {
      await db.models.VisaInfo.update(
        {
          id_country_info: id_country_info,
          documentation: documentation,
          visa_needed: visa_needed,
          additional_info: additional_info,
          countryId: country_id,
        },
        {
          where: { id: id },
        }
      );

      const updatedVisaInfo = await db.models.VisaInfo.findByPk(id);
      return updatedVisaInfo;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new VisaInfoService();
