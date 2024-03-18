import { Router } from "express";
import controller from "../controllers/specificityController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// POST /api/v1/specificities

/**
 * @openapi
 *  /api/v1/specificities/{id}:
 *    post:
 *      summary: Add specifity for some country
 *      tags:
 *        - Specifities
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: "Id of article for which are recommended articles being fetched"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AddSpecifityBody'
 *      responses:
 *        '200':
 *          description: An object with added specifity data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AddSpecifityResponse'
 *        '500':
 *          description: Error fetching specifity because of server
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ServerErrorResponse'
 */
router.post("/:id", verifyToken, controller.addSpecificities);

// PATCH /api/v1/specificities/4

/**
 * @openapi
 *  /api/v1/specificities/{id}:
 *    patch:
 *      summary: Edit specifity for some country
 *      tags:
 *        - Specifities
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: "Id of the specifity to be updated"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateSpecifityBody'
 *      responses:
 *        '200':
 *          description: An object with updated specifity data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UpdateSpecifityResponse'
 *        '500':
 *          description: Error fetching specifity because of server
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ServerErrorResponse'
 */
router.patch("/:id", verifyToken, controller.patchSpecificities);

export default router;
