import { Router } from "express";
import controller from "../controllers/galleryImageController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// POST /api/v1/gallery-images
router.post("/", verifyToken, controller.addGalleryImage);

// DELETE /api/v1/gallery-images/4
router.delete("/:id", controller.deleteGalleryImage);

export default router;
