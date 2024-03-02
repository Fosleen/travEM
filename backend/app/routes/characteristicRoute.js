import { Router } from "express";
import controller from "../controllers/characteristicController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// POST /api/v1/characteristics
/**
 * @openapi
 *  '/api/v1/characteristics':
 *  post:
 *      summary: Add a new characteristic
 *      tags:
 *          - Characteristic
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddCharacteristicBody'
 *      responses:
 *          200:
 *              description: The characteristic was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AddCharacteristicResponse'
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          500:
 *              description: Error inserting characteristic because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.post("/", verifyToken, controller.addCharacteristic);

// PATCH /api/v1/characteristics/4
/**
 * @openapi
 *  '/api/v1/characteristics/{id}':
 *  patch:
 *      summary: Update a characteristic or parts of it
 *      tags:
 *          - Characteristic
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateCharacteristicParams'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateCharacteristicBody'
 *      responses:
 *          200:
 *              description: The characteristic was successfully updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateCharacteristicResponse'
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          404:
 *              description: Characteristic with the provided was not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CharacteristicNotFoundErrorResponse'
 *          500:
 *              description: Error updating characteristic because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.patch("/:id", verifyToken, controller.patchCharacteristic);

export default router;
