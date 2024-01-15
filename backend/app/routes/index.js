import { Router } from "express";
import homepage from "./homepageRoute.js";
import { login, register } from "../middleware/auth.js";

const router = new Router();

router.use("/homepage", homepage);
router.use("/register", register);
router.use("/login", login);

export default router;
