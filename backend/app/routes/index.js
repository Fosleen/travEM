import { Router } from "express";
import homepage from "./homepageRoute.js";
import articleType from "./articleTypeRoute.js";
import article from "./articleRoute.js";
import section from "./sectionRoute.js";
import { login, register } from "../middleware/auth.js";
import place from "./placeRoute.js";
import country from "./countryRoute.js";
import continent from "./continentRoute.js";
import sectionIcon from "./sectionIconRoute.js";
import galleryImage from "./galleryImageRoute.js";
import sectionImage from "./sectionImageRoute.js";
import visaInfo from "./visaInfoRoute.js";
import characteristic from "./characteristicRoute.js";
import specificity from "./specificityRoute.js";
import color from "./colorRoute.js";
import characteristicIcon from "./characteristicIconRoute.js";

const router = new Router();

router.use("/homepage", homepage);
router.use("/article-types", articleType);
router.use("/articles", article);
router.use("/sections", section);
router.use("/section-icons", sectionIcon);
router.use("/gallery-images", galleryImage);
router.use("/section-images", sectionImage);
router.use("/visa-info", visaInfo);
router.use("/characteristics", characteristic);
router.use("/specificities", specificity);
router.use("/colors", color);
router.use("/characteristic-icons", characteristicIcon);

router.use("/register", register);
router.use("/login", login);
router.use("/places", place);
router.use("/countries", country);
router.use("/continents", continent);

export default router;
