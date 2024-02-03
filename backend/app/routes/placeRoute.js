import { Router } from "express";
import controller from "../controllers/placeController.js";

const router = new Router();

router.get("/map", controller.getFavoritePlaces);

export default router;
