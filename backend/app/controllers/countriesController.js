import service from "../services/countriesService.js";

class CountriesController {
  async getCountries(req, res) {
    const response = await service.getCountries();
    if (response == undefined) {
      res.status(404).json({ error: "No countries found" });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new CountriesController();
