import { Router } from "express";
import controller from "../controllers/videoController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/videos
router.get("/", controller.getVideos);

// POST /api/v1/videos
router.post("/", verifyToken, controller.addVideo);

// PATCH /api/v1/videos/4
router.patch("/:id", controller.patchVideo);

// DELETE /api/v1/videos/4
router.delete("/:id", controller.deleteVideo);

export default router;
