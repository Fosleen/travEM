import { Router } from "express";
import controller from "../controllers/countryBestTimeToVisitController.js";

const router = new Router();

router.get("/country/:countryId", controller.getByCountryId);
router.get("/:slug", controller.getBySlug);

export default router;