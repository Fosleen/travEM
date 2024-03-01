import { Router } from "express";
import controller from "../controllers/visaInfoController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/visa-info/3
router.get("/:id", controller.getVisaInfoById);

// GET /api/v1/visa-info?country1=1&country2=2
router.get("/", controller.getVisaInfoByCountries);

// POST /api/v1/visa-info
router.post("/", verifyToken, controller.addVisaInfo);

// PATCH /api/v1/visa-info/4
router.patch("/:id", verifyToken, controller.patchVisaInfo);

export default router;
