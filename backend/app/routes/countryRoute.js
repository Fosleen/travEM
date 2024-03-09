import { Router } from "express";
import controller from "../controllers/countryController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/countries/?page=1&pageSize=8

/**
 * @openapi
 *  '/api/v1/countries':
 *  get:
 *      summary: Get countries based on pagination
 *      tags:
 *          - Countries
 *      description: Returns an object with an array of countries 
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            example: 1
 *          description: "Page number for pagination (default: 1)"
 *        - in: query
 *          name: pageSize
 *          schema:
 *            type: integer
 *            example: 12
 *          description: "Number of items per page (default: 12)"

 *      responses:
 *          200:
 *              description: An array of JSON objects with country data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Country'
 *          404:
 *              description: Countries were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CountriesNotFoundErrorResponse'
 *          500:
 *              description: Error fetching countries because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getCountries);

// GET /api/v1/countries/5

/**
 * @openapi
 *  /api/v1/countries/{id}:
 *    get:
 *      summary: Get data of country with provided id
 *      tags:
 *        - Countries

 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: "Id of country that will be fetched"
 *      responses:
 *        '200':
 *          description: An object with country data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AddSpecifityResponse'
 *        '500':
 *          description: Error fetching country info because of server
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/:id", controller.getCountryById);

// DELETE /api/v1/countries/2

/**
 * @openapi
 *  '/api/v1/countries/{id}':
 *  delete:
 *      summary: Delete country by id
 *      tags:
 *          - Countries
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/DeletecountryParams'
 *      responses:
 *          200:
 *              description: Country was successfully deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteResponse'
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          500:
 *              description: Error deleting country because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 *
 */
router.delete("/:id", verifyToken, controller.deleteCountry);

// GET /api/v1/countries/search/hrva?page=1&pageSize=8&isCount=1

/**
 * @openapi
 *  '/api/v1/countries/search/{name}':
 *  get:
 *      summary: Get all countries by name (search countries by name)
 *      tags:
 *          - Countries
 *      description: Returns an object with an array of countries that start with inserted string value (country title) and with basic info about those countries.
 *      parameters:
 *        - in: path
 *          name: name
 *          schema:
 *            type: string
 *            example: test
 *          description: "Textual value by which countries return if the country name starts with it"
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            example: 1
 *          description: "Page number for pagination (default: 1)"
 *        - in: query
 *          name: pageSize
 *          schema:
 *            type: integer
 *            example: 200
 *          description: "Number of items per page (default: 200)"
 *        - in: query
 *          name: isCount
 *          schema:
 *            type: boolean
 *            example: 200
 *          description: ""
 *      responses:
 *          200:
 *              description: An array of JSON objects with country data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetAllcountriesResponse'
 *          404:
 *              description: countries starting with searched text value were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/countriesNotFoundSearchedErrorResponse'
 *          500:
 *              description: Error fetching countries because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/search/:name", controller.getCountryByName);

// GET /api/v1/countries/places/5

/**
 * @openapi
 *  /api/v1/countries/places/{id}:
 *    get:
 *      summary: Get data of places inside country with provided id
 *      tags:
 *        - Countries
 *
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: "Id of country whose places will be fetched"
 *      responses:
 *        '200':
 *          description: An object with country places data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CountryPlaceResponse'
 *        '500':
 *          description: Error fetching country info because of server
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/places/:id", controller.getCountryPlaces);

// POST /api/v1/countries/

/**
 * @openapi
 *  '/api/v1/countries':
 *  post:
 *      summary: Add a new country
 *      tags:
 *          - Countries
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddCountryBody'
 *      responses:
 *          200:
 *              description: The country was added succesfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Country'

 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *
 */
router.post("/", verifyToken, controller.addCountry);

// PATCH /api/v1/countries/4

/**
 * @openapi
 *  '/api/v1/countries/{id}':
 *  patch:
 *      summary: Edit country by id
 *      tags:
 *          - Countries
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/DeletecountryParams'
 *
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Country'
 *      responses:
 *          200:
 *              description: Country was successfully edited
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteResponse'
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          500:
 *              description: Error editing country because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 *
 */
router.patch("/:id", verifyToken, controller.patchCountry);

export default router;
