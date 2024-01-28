import service from "../services/countryService.js";

class CountriesController {
  async getCountries(req, res) {
    const response = await service.getCountries();
    if (response == undefined) {
      res.status(404).json({ error: "No countries found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getCountryPlaces(req, res) {
    const { id } = req.params;
    const response = await service.getCountryPlaces(id);
    if (response == undefined) {
      res
        .status(404)
        .json({ error: `No places found for country with id ${id}}` });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new CountriesController();
