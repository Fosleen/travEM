import { Router } from "express";
import controller from "../controllers/airplaneTicketPromoController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

router.get("/", controller.getPromo);
router.patch("/", verifyToken, controller.patchPromo);

export default router;
