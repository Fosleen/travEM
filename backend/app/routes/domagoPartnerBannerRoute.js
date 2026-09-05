import { Router } from "express";
import controller from "../controllers/domagoPartnerBannerController.js";
import { verifyToken } from "../middleware/jwt_verify.js";
const router = new Router();
router.get("/", controller.get);
router.patch("/", verifyToken, controller.patch);
export default router;
