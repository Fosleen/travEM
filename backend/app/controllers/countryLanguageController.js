import service from "../services/countryLanguageService.js";

class CountryLanguageController {
  async getByCountryId(req, res) {
    const { countryId } = req.params;

    const response = await service.getByCountryId(countryId);

    if (!response) {
      res.status(404).json({
        error: `No language data found for country id ${countryId}`,
      });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new CountryLanguageController();