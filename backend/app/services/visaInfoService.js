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
}

export default new VisaInfoService();
