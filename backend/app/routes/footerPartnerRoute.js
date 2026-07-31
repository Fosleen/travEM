import { Router } from "express";
import controller from "../controllers/footerPartnerController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

router.get("/", controller.getActivePartners);
router.get("/admin", verifyToken, controller.getAllPartners);
router.post("/", verifyToken, controller.createPartner);
router.patch("/reorder", verifyToken, controller.reorderPartners);
router.patch("/:id", verifyToken, controller.updatePartner);
router.delete("/:id", verifyToken, controller.deletePartner);

export default router;
