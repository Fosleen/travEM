import { Router } from "express";
import controller from "../controllers/airportCityController.js";

const router = new Router();

router.get("/", controller.getAirportCities);

export default router;
