import { Router } from "express";
import controller from "../controllers/specificityItemController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/specificity-items/4

/**
 * @openapi
 *  '/api/v1/specificity-items/{id}':
 *  get:
 *      summary: Get specificity item with provided id
 *      tags:
 *          - Specificity item
 *      description: Returns specificity item with provided id.
 *
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateSpecificityitemParams'
 *      responses:
 *          200:
 *              description: Details of specificity item with given id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/specificityitem'
 *          404:
 *              description: Specificity item with provided id was not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SpecificityItemNotFoundErrorResponse'
 *          500:
 *              description: Error fetching colors because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/:id", controller.getSpecificityItemById);

// POST /api/v1/specificity-items

/**
 * @openapi
 *  '/api/v1/specificity-items':
 *  post:
 *      summary: Add a new specificity item
 *      tags:
 *          - Specificity item
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddSpecificityItemBody'
 *      responses:
 *          200:
 *              description: Specificity item was successfully added
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SpecificityItem'
 *
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *
 */
router.post("/", verifyToken, controller.addSpecificityItem);

// PATCH /api/v1/specificity-items/4

/**
 * @openapi
 *  '/api/v1/specificity-items/{id}':
 *  patch:
 *      summary: Edit specificity item with given id
 *      tags:
 *          - Specificity item
 *      description: Change data of specificity item.
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddSpecificityItemBody'
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateSpecificityitemParams'
 *      responses:
 *          200:
 *              description: An object with updated specificity item data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Specificityitem'
 * 
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          404:
 *              description: Specificity item with the provided id was not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SpecificityItemNotFoundErrorResponse'

 *          500:
 *              description: Error inserting specificity item because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.patch("/:id", verifyToken, controller.patchSpecificityItem);

// DELETE /api/v1/specificity-items/4

/**
 * @openapi
 *  '/api/v1/specificity-items/{id}':
 *  delete:
 *      summary: Delete specificity item with given id
 *      tags:
 *          - Specificity item
 *      description: Delete specificity item.
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateSpecificityitemParams'
 *      responses:
 *          200:
 *              description: Specificity item was successfully deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteResponse'
 * 
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          404:
 *              description: Specificity item with the provided id was not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SpecificityItemNotFoundErrorResponse'

 *          500:
 *              description: Error inserting Specificity item because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.delete("/:id", verifyToken, controller.deleteSpecificityItem);

export default router;
