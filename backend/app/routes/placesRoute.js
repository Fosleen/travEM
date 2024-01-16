import { Router } from "express";
import placesController from "../controllers/placesController.js";

const router = new Router();

router.get("/", placesController.getCountries);

router.get("/favorite", placesController.getFavoritePlaces);

router.get("/continent/:id", placesController.getContinentCountries);

export default router;
