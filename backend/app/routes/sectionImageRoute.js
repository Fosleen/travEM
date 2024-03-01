import { Router } from "express";
import controller from "../controllers/sectionImageController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// POST /api/v1/section-images
router.post("/", verifyToken, controller.addSectionImage);

// PATCH /api/v1/section-images/3
router.patch("/:id", verifyToken, controller.patchSectionImage);

// DELETE /api/v1/section-images/4
router.delete("/:id", verifyToken, controller.deleteSectionImage);

export default router;
