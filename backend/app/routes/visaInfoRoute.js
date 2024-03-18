import { Router } from "express";
import controller from "../controllers/visaInfoController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/visa-info/3

/**
 * @openapi
 *  '/api/v1/visa-info/{id}':
 *  get:
 *      summary: Get visa info item with provided id
 *      tags:
 *          - Visa info
 *      description: Returns visa info item with provided id.
 *
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateSpecificityitemParams'
 *      responses:
 *          200:
 *              description: Details of visa info item with given id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VisaInfo'
 *          404:
 *              description: visa info item with provided id was not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VisaItemNotFoundErrorResponse'
 *          500:
 *              description: Error fetching visa info item because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/:id", controller.getVisaInfoById);

// GET /api/v1/visa-info?country1=1&country2=2

/**
 * @openapi
 *  '/api/v1/visa-info':
 *  get:
 *      summary: Get visa info for 2 countries
 *      tags:
 *          - Visa info
 *      description: Returns an object that is used to determine if passenger needs visa for traveling from-to country
 *      parameters:
 *        - in: query
 *          name: country1
 *          schema:
 *            type: integer
 *            example: 1
 *          description: "Id of first country"
 *        - in: query
 *          name: country2
 *          schema:
 *            type: integer
 *            example: 12
 *          description: "Id of second country"
 *      responses:
 *          200:
 *              description: JSON object with data for visa
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetVisaInfoForCountriesBody'
 *          404:
 *              description: Visa info not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VisaInfoNotFoundErrorResponse'
 *          500:
 *              description: Error fetching visa info because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getVisaInfoByCountries);

/**
 * @openapi
 *  '/api/v1/visa-info':
 *  post:
 *      summary: Add a new visa info item
 *      tags:
 *          - Visa info
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddVisaInfoBody'
 *      responses:
 *          200:
 *              description: Visa info was successfully added
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VisaInfo'
 *
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *
 *          500:
 *              description: Error inserting visa info because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 *
 */
// POST /api/v1/visa-info
router.post("/", verifyToken, controller.addVisaInfo);

// PATCH /api/v1/visa-info/4

/**
 * @openapi
 *  '/api/v1/visa-info/{id}':
 *  patch:
 *      summary: Edit visa info with given id
 *      tags:
 *          - Visa info
 *      description: Change data of visa info.
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddVisaInfoBody'
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateSpecificityitemParams'
 *      responses:
 *          200:
 *              description: An object with updated visa info data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VisaInfo'
 * 
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          404:
 *              description: Visa info item with the provided id was not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VisaInfoNotFoundErrorResponse'

 *          500:
 *              description: Error inserting visa info item because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.patch("/:id", verifyToken, controller.patchVisaInfo);

export default router;
