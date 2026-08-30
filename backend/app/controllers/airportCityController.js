import airportCityService from "../services/airportCityService.js";

class AirportCityController {
  async getAirportCities(req, res) {
    try {
      const response = await airportCityService.getAirportCities(false);
      if (response.length == 0) {
        res.status(404).json({ error: `No airport cities found` });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAirportCitiesAdmin(_req, res) {
    try {
      return res.status(200).json(await airportCityService.getAirportCities(true));
    } catch (_error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async createAirportCity(req, res) {
    try {
      if (
        !req.body.name?.trim() ||
        !req.body.flag_url?.trim() ||
        !req.body.banner_image_url?.trim()
      ) {
        return res.status(400).json({
          error: "Name, flag URL and banner image URL are required",
        });
      }
      return res.status(201).json(await airportCityService.createAirportCity(req.body));
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateAirportCity(req, res) {
    try {
      const airport = await airportCityService.updateAirportCity(req.params.id, req.body);
      if (!airport) return res.status(404).json({ error: "Airport not found" });
      return res.status(200).json(airport);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new AirportCityController();
