import { Router } from "express";
import controller from "../controllers/sectionImageController.js";

const router = new Router();

// POST /api/v1/section-images
router.post("/", controller.addSectionImage);

// PATCH /api/v1/section-images/3
router.patch("/:id", controller.patchSectionImage);

// DELETE /api/v1/section-images/4
router.delete("/:id", controller.deleteSectionImage);

export default router;
