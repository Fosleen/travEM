import { Router } from "express";
import homepage from "./homepageRoute.js";
import articleType from "./articleTypeRoute.js";
import article from "./articleRoute.js";
import { login, register } from "../middleware/auth.js";

const router = new Router();

router.use("/homepage", homepage);
router.use("/article-types", articleType);
router.use("/articles", article);

router.use("/register", register);
router.use("/login", login);

export default router;
