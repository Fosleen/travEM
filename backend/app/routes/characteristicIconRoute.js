import { Router } from "express";
import controller from "../controllers/characteristicIconController.js";

const router = new Router();

// GET /api/v1/characteristic-icons
/**
 * @openapi
 *  '/api/v1/characteristic-icons':
 *  get:
 *      summary: Get all characteristic icons
 *      tags:
 *          - Characteristic icon
 *      description: Returns an array of characteristic icons with id and url.
 *      responses:
 *          200:
 *              description: An array of JSON objects with characteristic icon data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetAllCharacteristicIconsResponse'
 *          404:
 *              description: Characteristic icons were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CharacteristicIconsNotFoundErrorResponse'
 *          500:
 *              description: Error fetching characteristic icons because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getCharacteristicIcons);

export default router;
