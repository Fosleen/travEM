import { Router } from "express";
import controller from "../controllers/continentController.js";

const router = new Router();

// GET /api/v1/continents/countries/1
router.get("/countries/:id", controller.getContinentCountries);

// GET /api/v1/continents/places/1
router.get("/places/:id", controller.getContinentPlaces);

export default router;
