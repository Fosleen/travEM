import { Router } from "express";
import controller from "../controllers/characteristicController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// POST /api/v1/characteristics
router.post("/", verifyToken, controller.addCharacteristic);

// PATCH /api/v1/characteristics/4
router.patch("/:id", controller.patchCharacteristic);

export default router;
