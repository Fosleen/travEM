import { Router } from "express";
import controller from "../controllers/continentController.js";

const router = new Router();

// GET /api/v1/continents
/**
 * @openapi
 *  '/api/v1/continents':
 *  get:
 *      summary: Get all continents
 *      tags:
 *          - Continent
 *      description: Returns an array of continent data objects with id and name
 *      responses:
 *          '200':
 *              description: A JSON object with an array of continents.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetAllContinentsResponse'
 */
router.get("/", controller.getContinents);

// GET /api/v1/continents/1
router.get("/:id", controller.getContinentById);

// GET /api/v1/continents/countries/1
router.get("/countries/:id", controller.getContinentCountries);

// GET /api/v1/continents/places/1
router.get("/places/:id", controller.getContinentPlaces);

export default router;
