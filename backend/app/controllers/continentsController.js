import service from "../services/continentsService.js";

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
}

export default new ContinentsController();
