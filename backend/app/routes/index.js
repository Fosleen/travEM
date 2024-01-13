import { Router } from "express";
import homepage from "./homepageRoute.js";

const router = new Router();

router.use("/homepage", homepage);

export default router;
