import service from "../services/continentService.js";

class ContinentsController {
  async getContinents(req, res) {
    const response = await service.getContinents();
    if (response == undefined) {
      res.status(404).json({ error: "No continents found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getContinentById(req, res) {
    const { id } = req.params;
    const response = await service.getContinentById(id);
    if (response == undefined) {
      res.status(404).json({ error: "No continents found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getContinentCountries(req, res) {
    const { id } = req.params;
    const response = await service.getContinentCountries(id);
    if (response == undefined) {
      res.status(404).json({ error: "No continent countries found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getContinentPlaces(req, res) {
    const { id } = req.params;
    const response = await service.getContinentPlaces(id);
    if (response == undefined) {
      res.status(404).json({ error: "No continent places found" });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new ContinentsController();
