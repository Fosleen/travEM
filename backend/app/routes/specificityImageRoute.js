import { Router } from "express";
import controller from "../controllers/specificityImageController.js";

const router = new Router();

// GET /api/v1/specificity-images/4
router.get("/:id", controller.getSpecificityImageById);

// POST /api/v1/specificity-images
router.post("/", controller.addSpecificityImage);

// PATCH /api/v1/specificity-images/4
router.patch("/:id", controller.patchSpecificityImage);

// DELETE /api/v1/specificity-images/4
router.delete("/:id", controller.deleteSpecificityImage);

export default router;
