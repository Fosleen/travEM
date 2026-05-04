import { Router } from "express";
import controller from "../controllers/placeBestTimeToVisitController.js";

const router = new Router();

router.get("/:slug", controller.getBySlug);

export default router;