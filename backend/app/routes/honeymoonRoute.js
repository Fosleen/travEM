import { Router } from "express";
import controller from "../controllers/honeymoonController.js";
import { verifyToken } from "../middleware/jwt_verify.js";
import { honeymoonRateLimit } from "../middleware/honeymoonRateLimit.js";

const router = Router();
router.get("/settings", controller.getSettings);
router.get("/programs", controller.getPublicPrograms);
router.post("/inquiries", honeymoonRateLimit, controller.createInquiry);
router.get("/admin/programs", verifyToken, controller.getAdminPrograms);
router.put("/admin/settings", verifyToken, controller.updateSettings);
router.post("/admin/programs", verifyToken, controller.createProgram);
router.put("/admin/programs/:id", verifyToken, controller.updateProgram);
router.delete("/admin/programs/:id", verifyToken, controller.deleteProgram);
router.get("/admin/inquiries", verifyToken, controller.getInquiries);
router.delete("/admin/inquiries/:id", verifyToken, controller.dismissInquiry);
export default router;
