import { Router } from "express";
import continentsController from "../controllers/continentController.js";

const router = new Router();

router.get("/countries/:id", continentsController.getContinentCountries);

export default router;
