import { Router } from "express";
import controller from "../controllers/countryController.js";

const router = new Router();

// GET /api/v1/countries/
router.get("/", controller.getCountries);

// GET /api/v1/countries/5
router.get("/:id", controller.getCountryById);

// DELETE /api/v1/countries/2
router.delete("/:id", controller.deleteCountry);

// GET /api/v1/countries/search/hrva
router.get("/search/:name", controller.getCountryByName);

// GET /api/v1/countries/places/5
router.get("/places/:id", controller.getCountryPlaces);

// POST /api/v1/countries/
router.post("/", controller.addCountry);

// PATCH /api/v1/countries/4
router.patch("/:id", controller.patchCountry);

export default router;
