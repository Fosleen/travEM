import db from "../models/index.js";
import { Op, Sequelize } from "sequelize";

class AirportCityService {
  async getAirportCities() {
    try {
      const airportCities = await db.models.AirportCity.findAll({});
      return airportCities;
    } catch (error) {
      return [];
    }
  }
}

export default new AirportCityService();
