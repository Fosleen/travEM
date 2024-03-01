import { Router } from "express";
import controller from "../controllers/colorController.js";

const router = new Router();

// GET /api/v1/colors
/**
 * @openapi
 *  '/api/v1/colors':
 *  get:
 *      summary: Get colors by id
 *      tags:
 *          - Color
 *      description: Returns an array of colors with id, hex_value, name and url.
 *      responses:
 *          200:
 *              description: An array of JSON objects with color data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetAllColorsResponse'
 *          404:
 *              description: Colors were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ColorsNotFoundErrorResponse'
 *          500:
 *              description: Error fetching continent because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getColors);

export default router;
