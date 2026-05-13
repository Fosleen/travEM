import { Router } from "express";
import controller from "../controllers/countryLanguageController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

router.get("/country/:countryId", controller.getByCountryId);
router.post("/", verifyToken, controller.add);
router.patch("/:id", verifyToken, controller.patch);

export default router;