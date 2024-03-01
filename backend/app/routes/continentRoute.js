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
 *      description: Returns an array of continent data objects with id, name, latitude, longitude and zoom.
 *      responses:
 *          200:
 *              description: A JSON object with an array of continents.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetAllContinentsResponse'
 *          404:
 *              description: The continents were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ContinentsNotFoundErrorResponse'
 *          500:
 *              description: Error fetching continent because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getContinents);

// GET /api/v1/continents/1
/**
 * @openapi
 *  '/api/v1/continents/{id}':
 *  get:
 *      summary: Get continent by id
 *      tags:
 *          - Continent
 *      description: Returns a continent data object with id, name, latitude, longitude and zoom.
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *      responses:
 *          200:
 *              description: A JSON object with continent that has selected id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetContinentByIdResponse'
 *          404:
 *              description: The continent with provided id was not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ContinentNotFoundErrorResponse'
 *          500:
 *              description: Error fetching continent because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/:id", controller.getContinentById);

// GET /api/v1/continents/countries/1
/**
 * @openapi
 *  '/api/v1/continents/countries/{id}':
 *  get:
 *      summary: Get all countries that are on the continent by continent id
 *      tags:
 *          - Continent
 *      description: Returns an array of countries with with id, name, description, main_image_url, flag_image_url, colorId and continentId.
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *      responses:
 *          200:
 *              description: An array of JSON objects with data about countries that belong to selected continent.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetCountriesByContinentIdResponse'
 *          404:
 *              description: No continent with provided id was found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ContinentNotFoundErrorResponse'
 *          500:
 *              description: Error fetching continent countries because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/countries/:id", controller.getContinentCountries);

// GET /api/v1/continents/places/1
/**
 * @openapi
 *  '/api/v1/continents/places/{id}':
 *  get:
 *      summary: Get all places that are on the continent by continent id
 *      tags:
 *          - Continent
 *      description: Returns an array of places with with id, name, description, main_image_url, latitude, longitude, is_on_homepage_map, is_above_homepage_map, map_icon and countryId.
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *      responses:
 *          200:
 *              description: An array of JSON objects with data about places that belong to selected continent.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetPlacesByContinentIdResponse'
 *          404:
 *              description: No continent with provided id was found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ContinentNotFoundErrorResponse'
 *          500:
 *              description: Error fetching continent places because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/places/:id", controller.getContinentPlaces);

export default router;
