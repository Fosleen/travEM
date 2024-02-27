import airportCityService from "../services/airportCityService.js";

class AirportCityController {
  async getAirportCities(req, res) {
    const response = await airportCityService.getAirportCities();
    if (response.length == 0) {
      res.status(404).json({ error: `No airport cities found` });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new AirportCityController();
