import { Router } from "express";
import { getAll } from "../controllers/homepageController.js";

const router = new Router();

// GET /api/homepage
router.get("/", getAll);

export default router;
