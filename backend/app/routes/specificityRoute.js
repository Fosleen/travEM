import { Router } from "express";
import controller from "../controllers/specificityController.js";

const router = new Router();

// POST /api/v1/specificities
router.post("/", controller.addSpecificities);

// PATCH /api/v1/specificities/4
router.patch("/:id", controller.patchSpecificities);

export default router;
