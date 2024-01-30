import { Router } from "express";
import controller from "../controllers/countryController.js";

const router = new Router();

router.get("/", controller.getCountries);
router.get("/:id", controller.getCountryById);
router.delete("/:id", controller.deleteCountry);
router.get("/search/:name", controller.getCountryByName);
router.get("/places/:id", controller.getCountryPlaces);
router.post("/", controller.addCountry);

export default router;
