import { Router } from "express";
import countriesController from "../controllers/countryController.js";

const router = new Router();

router.get("/", countriesController.getCountries);
router.get("/places/:id", countriesController.getCountryPlaces);

export default router;
