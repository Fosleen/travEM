import { Router } from "express";
import controller from "../controllers/airportCityController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/airport-cities
/**
 * @openapi
 *  '/api/v1/airport-cities':
 *  get:
 *      summary: Get all cities with airport
 *      tags:
 *          - Airport city
 *      description: Returns an array of cities that have an airport
 *      responses:
 *          200:
 *              description: An array of JSON objects with airport cities data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetAllAirportCitiesResponse'
 *          404:
 *              description: No airport cities found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AirportCitiesNotFoundErrorResponse'
 *          500:
 *              description: Error fetching airport cities because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */

router.get("/admin", verifyToken, controller.getAirportCitiesAdmin);
router.post("/", verifyToken, controller.createAirportCity);
router.patch("/:id", verifyToken, controller.updateAirportCity);
router.get("/", controller.getAirportCities);

export default router;
