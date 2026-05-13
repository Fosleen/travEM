import { Router } from "express";
import controller from "../controllers/countryLanguageController.js";

const router = new Router();

router.get("/country/:countryId", controller.getByCountryId);

export default router;