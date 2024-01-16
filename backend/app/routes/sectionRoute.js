import { Router } from "express";
import controller from "../controllers/sectionController.js";

const router = new Router();

// POST /api/v1/sections
router.post("/", controller.addSection);

// PATCH /api/v1/sections/4
router.patch("/:id", controller.patchSection);

export default router;
