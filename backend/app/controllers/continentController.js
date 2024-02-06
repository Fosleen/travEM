import service from "../services/continentService.js";

class ContinentsController {
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
