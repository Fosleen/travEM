import { Router } from "express";
import homepage from "./homepageRoute.js";
import { login, register } from "../middleware/auth.js";
import map from "./mapRoute.js";

const router = new Router();

router.use("/homepage", homepage);
router.use("/register", register);
router.use("/login", login);
router.use("/map", map);

export default router;
