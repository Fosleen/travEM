import { Router } from "express";
import homepage from "./homepageRoute.js";
import authRouter from "./auth.js"; //mora biti bez {} zagrada

const router = new Router();

router.use("/homepage", homepage);
router.use("/login", authRouter);

export default router;
