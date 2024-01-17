import { Router } from "express";
import placesController from "../controllers/placesController.js";

const router = new Router();

router.get("/map", placesController.getFavoritePlaces);

export default router;
