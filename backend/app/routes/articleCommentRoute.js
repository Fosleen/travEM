import { Router } from "express";
import controller from "../controllers/articleCommentController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

router.get("/unsubscribe", controller.unsubscribe);
router.get("/pending", verifyToken, controller.getPendingComments);
router.patch("/:commentId/status", verifyToken, controller.setCommentStatus);
router.delete("/:commentId", verifyToken, controller.deleteComment);
router.post("/:commentId/like", controller.likeComment);
router.delete("/:commentId/like", controller.unlikeComment);

export default router;
