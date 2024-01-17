import { Router } from "express";
import placesController from "../controllers/placesController.js";

const router = new Router();

router.get("/map", placesController.getFavoritePlaces);

router.get("/continent/:id", placesController.getContinentCountries);

export default router;
