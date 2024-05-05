import { Router } from "express";
import controller from "../controllers/specificityController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// POST /api/v1/specificities

/**
 * @openapi
 *  /api/v1/specificities:
 *    post:
 *      summary: Add specificity for some country
 *      tags:
 *        - Specifities
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AddSpecificityBody'
 *      responses:
 *        '200':
 *          description: An object with added specificity data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AddSpecificityResponse'
 *        '500':
 *          description: Error fetching specificity because of server
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ServerErrorResponse'
 */
router.post("/", verifyToken, controller.addSpecificities);

// PATCH /api/v1/specificities/4

/**
 * @openapi
 *  /api/v1/specificities/{id}:
 *    patch:
 *      summary: Edit specificity for some country
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
 *          description: "Id of the specificity to be updated"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateSpecificityBody'
 *      responses:
 *        '200':
 *          description: An object with updated specificity data.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UpdateSpecificityResponse'
 *        '500':
 *          description: Error fetching specificity because of server
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ServerErrorResponse'
 */
router.patch("/:id", verifyToken, controller.patchSpecificities);

export default router;
