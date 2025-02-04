import { Router } from "express";
import controller from "../controllers/subscriberController.js";

const router = new Router();
router.get("/", controller.getSubscribers);
router.post("/", controller.addSubscriber);
router.post("/send-newsletter", controller.sendNewsletter);

export default router;
