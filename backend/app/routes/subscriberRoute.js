import { Router } from "express";
import controller from "../controllers/subscriberController.js";

const router = new Router();
router.get("/", controller.getSubscribers);
router.post("/", controller.addSubscriber);

export default router;
