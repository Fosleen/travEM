import { Router } from "express";
import controller from "../controllers/placeController.js";

const router = new Router();

// GET /api/v1/places/map
router.get("/map", controller.getFavoritePlaces);

// GET /api/v1/places/above-map
router.get("/above-map", controller.getFeaturedPlaces);

// GET /api/v1/places?page=1&pageSize=12
router.get("/", controller.getPlaces);

// GET /api/v1/places/1
// router.get("/:id", controller.getPlaceById); // changed to getPlaceByName

// GET /api/v1/places/zagreb
router.get("/:name", controller.getPlaceByName);

// GET /api/v1/places/search/zagr
router.get("/search/:name", controller.getPlaceByName);

// POST /api/v1/places/
router.post("/", controller.addPlace);

// PATCH /api/v1/places/4
router.patch("/:id", controller.patchPlace);

// DELETE /api/v1/countries/2
router.delete("/:id", controller.deletePlaceAndArticles);

export default router;
