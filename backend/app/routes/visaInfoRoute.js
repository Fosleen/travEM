import { Router } from "express";
import controller from "../controllers/visaInfoController.js";

const router = new Router();

// POST /api/v1/visa-info
router.post("/", controller.addVisaInfo);

// PATCH /api/v1/visa-info/4
router.patch("/:id", controller.patchVisaInfo)

export default router;
