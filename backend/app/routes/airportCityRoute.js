import { Router } from "express";
import controller from "../controllers/airportCityController.js";

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

router.get("/", controller.getAirportCities);

export default router;
