import { Router } from "express";
import controller from "../controllers/characteristicController.js";

const router = new Router();

// POST /api/v1/characteristics
router.post("/", controller.addCharacteristic);

// PATCH /api/v1/characteristics/4
router.patch("/:id", controller.patchCharacteristic);

export default router;
