import { Router } from "express";
import controller from "../controllers/footerController.js";

const router = new Router();

// GET /api/v1/footer
router.get("/", controller.getFooter);

// PATCH /api/v1/footer
router.patch("/", controller.patchFooter);

export default router;
