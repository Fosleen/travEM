import service from "../services/placesService.js";

class PlacesController {
  async getFavoritePlaces(req, res) {
    const response = await service.getFavoritePlaces();
    if (response == undefined) {
      res.status(404).json({ error: "No favorite places found" });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new PlacesController();
