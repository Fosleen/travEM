import service from "../services/continentService.js";

class ContinentsController {
  async getContinents(req, res) {
    try {
      const response = await service.getContinents();
      if (response == undefined) {
        res.status(404).json({ error: "No continents found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getContinentById(req, res) {
    try {
      const { id } = req.params;
      const response = await service.getContinentById(id);
      if (response == undefined) {
        res.status(404).json({ error: "No continent found" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getContinentCountries(req, res) {
    try {
      const { id } = req.params;
      const response = await service.getContinentCountries(id);
      if (response === "Continent not found") {
        return res
          .status(404)
          .json({ error: "Continent with the provided ID doesn't exist" });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getContinentPlaces(req, res) {
    try {
      const { id } = req.params;
      const response = await service.getContinentPlaces(id);

      if (response === "Continent not found") {
        return res
          .status(404)
          .json({ error: "Continent with the provided ID doesn't exist" });
      } else {
        return res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new ContinentsController();
