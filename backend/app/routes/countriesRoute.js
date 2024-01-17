import { Router } from "express";
import countriesController from "../controllers/countriesController.js";

const router = new Router();

router.get("/", countriesController.getCountries);

export default router;
