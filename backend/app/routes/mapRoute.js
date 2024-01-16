import { Router } from "express";

import controller from "../controllers/mapController.js";

const router = new Router();

router.get("/", controller.getCountries);

router.get("/favorite-places", controller.getFavoritePlaces);

export default router;
