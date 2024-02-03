import { Router } from "express";
import controller from "../controllers/characteristicIconController.js";

const router = new Router();

// GET /api/v1/characteristic-icon
router.get("/", controller.getCharacteristicIcons);

export default router;
