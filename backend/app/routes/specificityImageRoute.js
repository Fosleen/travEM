import { Router } from "express";
import controller from "../controllers/specificityImageController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/specificity-images/4
router.get("/:id", controller.getSpecificityImageById);

// POST /api/v1/specificity-images
router.post("/", verifyToken, controller.addSpecificityImage);

// PATCH /api/v1/specificity-images/4
router.patch("/:id", verifyToken, controller.patchSpecificityImage);

// DELETE /api/v1/specificity-images/4
router.delete("/:id", verifyToken, controller.deleteSpecificityImage);

export default router;
