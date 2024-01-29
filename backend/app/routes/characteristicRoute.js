import { Router } from "express";
import characteristicController from "../controllers/characteristicController.js";

const router = new Router();

// POST /api/v1/characteristics
router.post("/", characteristicController.addCharacteristic);

export default router;
