import { Router } from "express";
import controller from "../controllers/countryController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/countries/?page=1&pageSize=8
router.get("/", controller.getCountries);

// GET /api/v1/countries/5
router.get("/:id", controller.getCountryById);

// DELETE /api/v1/countries/2
router.delete("/:id", verifyToken, controller.deleteCountry);

// GET /api/v1/countries/search/hrva?page=1&pageSize=8&isCount=1
router.get("/search/:name", controller.getCountryByName);

// GET /api/v1/countries/places/5
router.get("/places/:id", controller.getCountryPlaces);

// POST /api/v1/countries/
router.post("/", verifyToken, controller.addCountry);

// PATCH /api/v1/countries/4
router.patch("/:id", verifyToken, controller.patchCountry);

export default router;
