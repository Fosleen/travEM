import { Router } from "express";
import controller from "../controllers/sectionController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// POST /api/v1/sections
router.post("/", verifyToken, controller.addSection);

// PATCH /api/v1/sections/4
router.patch("/:id", controller.patchSection);

// DELETE /api/v1/sections/4
router.delete("/:id", controller.deleteSection);

export default router;
