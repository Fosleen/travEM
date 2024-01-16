import service from "../services/placesService.js";

class PlacesController {
  async getCountries(req, res) {
    const response = await service.getCountries();
    if (response == undefined) {
      res.status(404).json({ error: "No countries found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getFavoritePlaces(req, res) {
    const response = await service.getFavoritePlaces();
    if (response == undefined) {
      res.status(404).json({ error: "No favorite places found" });
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
}

export default new PlacesController();
