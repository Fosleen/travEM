import service from "../services/countryService.js";

class CountriesController {
  async getCountries(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 200;

    const response = await service.getCountries(page, pageSize);
    if (response == undefined) {
      res.status(404).json({ error: "No countries found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getCountryById(req, res) {
    const { id } = req.params;
    const response = await service.getCountryById(id);
    if (!response || response.length == 0) {
      res.status(404).json({ error: `No country found by id ${id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async getCountryByName(req, res) {
    const { name } = req.params;
    const response = await service.getCountryByName(name);
    if (!response || response.length == 0) {
      res.status(404).json({ error: `No country found by name ${name}` });
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
