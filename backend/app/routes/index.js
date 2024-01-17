import { Router } from "express";
import homepage from "./homepageRoute.js";
import { login, register } from "../middleware/auth.js";
import places from "./placesRoute.js";
import countries from "./countriesRoute.js";
import continents from "./continentsRoute.js";

const router = new Router();

router.use("/homepage", homepage);
router.use("/register", register);
router.use("/login", login);
router.use("/places", places);
router.use("/countries", countries);
router.use("/continents", continents);

export default router;
