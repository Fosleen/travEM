import { Router } from "express";
import { getAll } from "../controllers/homepageController.js";

const router = new Router();

// GET /api/v1/homepage
router.get("/", getAll);

export default router;
