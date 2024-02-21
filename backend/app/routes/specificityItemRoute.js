import { Router } from "express";
import controller from "../controllers/specificityItemController.js";

const router = new Router();

// GET /api/v1/specificity-items/4
router.get("/:id", controller.getSpecificityItemById);

// POST /api/v1/specificity-items
router.post("/", controller.addSpecificityItem);

// PATCH /api/v1/specificity-items/4
router.patch("/:id", controller.patchSpecificityItem);

// DELETE /api/v1/specificity-items/4
router.delete("/:id", controller.deleteSpecificityItem);

export default router;
