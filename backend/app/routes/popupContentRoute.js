import { Router } from "express";
import controller from "../controllers/popupContentController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

router.get("/", controller.getPopupContent);
router.patch("/", verifyToken, controller.patchPopupContent);

export default router;
