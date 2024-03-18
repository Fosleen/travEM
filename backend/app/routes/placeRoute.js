import { Router } from "express";
import controller from "../controllers/placeController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/places/map

/**
 * @openapi
 *  '/api/v1/places/map':
 *  get:
 *      summary: Get all places on map
 *      tags:
 *          - Places
 *      description: Returns places that are shown on map on homepage
 *      responses:
 *          200:
 *              description: An array of JSON objects with countries on map.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Place'
 *          404:
 *              description: Places on map were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PlacesNotFoundResponse'
 *          500:
 *              description: Error fetching places on map because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/map", controller.getFavoritePlaces);

// GET /api/v1/places/above-map

/**
 * @openapi
 *  '/api/v1/places/above-map':
 *  get:
 *      summary: Get all places above map
 *      tags:
 *          - Places
 *      description: Returns places that are shown on top of map on homepage
 *      responses:
 *          200:
 *              description: An array of JSON objects with countries above map.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Place'
 *          404:
 *              description: Places above map were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PlacesNotFoundResponse'
 *          500:
 *              description: Error fetching places above map because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/above-map", controller.getFeaturedPlaces);

// GET /api/v1/places/with-image

/**
 * @openapi
 *  '/api/v1/places/with-image':
 *  get:
 *      summary: Get all places with image
 *      tags:
 *          - Places
 *      description: Returns places with images
 *      responses:
 *          200:
 *              description: An array of JSON objects with countries that have images.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Place'
 *          404:
 *              description: Places with image were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PlacesNotFoundResponse'
 *          500:
 *              description: Error fetching places with image because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/with-image", controller.getPlacesWithImage);

// GET /api/v1/places?page=1&pageSize=12

/**
 * @openapi
 *  '/api/v1/places':
 *  get:
 *      summary: Get all places but paginated
 *      tags:
 *          - Places
 *      description: Returns an object with paginated places data
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
 *
 *      responses:
 *          200:
 *              description: An array of JSON objects with places data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Places'
 *          404:
 *              description: Places were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PlacesNotFoundResponse'
 *          500:
 *              description: Error fetching places because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getPlaces);

// GET /api/v1/places/zagreb

/**
 * @openapi
 *  '/api/v1/places/{name}':
 *  get:
 *      summary: Get all data for provided place
 *      tags:
 *          - Places
 *      description: Returns an object with an array of data for place whose name is sent
 *      parameters:
 *        - in: path
 *          name: name
 *          schema:
 *            type: string
 *            example: test
 *          description: "Textual value by which place details return if the place name starts with it"
 *
 *      responses:
 *          200:
 *              description: JSON object with place data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Place'
 *          404:
 *              description: places starting with searched text value were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PlacesNotFoundResponse'
 *          500:
 *              description: Error fetching place data because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/:name", controller.getPlaceByName);

// GET /api/v1/places/search/zagr

/**
 * @openapi
 *  '/api/v1/places/search/{name}':
 *  get:
 *      summary: Get all data for provided place
 *      tags:
 *          - Places
 *      description: Returns an object with an array of data for place whose name is sent
 *      parameters:
 *        - in: path
 *          name: name
 *          schema:
 *            type: string
 *            example: test
 *          description: "Textual value by which place details return if the place name starts with it"
 *
 *      responses:
 *          200:
 *              description: JSON object with place data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Place'
 *          404:
 *              description: places starting with searched text value were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PlacesNotFoundResponse'
 *          500:
 *              description: Error fetching place data because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/search/:name", controller.getPlaceByName);

// POST /api/v1/places/

/**
 * @openapi
 *  '/api/v1/places':
 *  post:
 *      summary: Add a new place
 *      tags:
 *          - Places
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddPlace'
 *      responses:
 *          200:
 *              description: The place was added succesfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Place'

 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *
 */
router.post("/", verifyToken, controller.addPlace);

// PATCH /api/v1/places/4

/**
 * @openapi
 *  '/api/v1/places/{id}':
 *  patch:
 *      summary: Edit place by id
 *      tags:
 *          - Places
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
 *                      $ref: '#/components/schemas/AddPlace'
 *      responses:
 *          200:
 *              description: Place was successfully edited
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
router.patch("/:id", verifyToken, controller.patchPlace);

// DELETE /api/v1/countries/2

/**
 * @openapi
 *  '/api/v1/places/{id}':
 *  delete:
 *      summary: Delete place by id
 *      tags:
 *          - Places
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/DeletecountryParams'
 *
 *      responses:
 *          200:
 *              description: Place was successfully deleted
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
router.delete("/:id", verifyToken, controller.deletePlaceAndArticles);

export default router;
