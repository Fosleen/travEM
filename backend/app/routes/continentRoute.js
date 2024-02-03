import { Router } from "express";
import controller from "../controllers/continentController.js";

const router = new Router();

router.get("/countries/:id", controller.getContinentCountries);

export default router;
