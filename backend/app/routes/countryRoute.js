import { Router } from "express";
import countriesController from "../controllers/countryController.js";

const router = new Router();

router.get("/", countriesController.getCountries);
router.get("/:id", countriesController.getCountryById);
router.delete("/:id", countriesController.deleteCountry);
router.get("/search/:name", countriesController.getCountryByName);
router.get("/places/:id", countriesController.getCountryPlaces);
router.post("/", countriesController.addCountry);

export default router;
