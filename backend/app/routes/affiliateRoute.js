import express from "express";
import controller from "../controllers/affiliateController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = express.Router();

router.get("/partners", controller.getPartners);
router.post("/partners", verifyToken, controller.addPartner);
router.patch("/partners/:id", verifyToken, controller.updatePartner);
router.put("/articles/:articleId", verifyToken, controller.syncArticleLinks);

export default router;
