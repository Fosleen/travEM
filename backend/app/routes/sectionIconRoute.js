import { Router } from "express";
import controller from "../controllers/sectionIconController.js";

const router = new Router();

// GET /api/v1/section-icons
/**
 * @openapi
 *  '/api/v1/section-icons':
 *  get:
 *      summary: Get all section icons
 *      tags:
 *          - Section icon
 *      description: Returns an array of section icons with id and url.
 *      responses:
 *          200:
 *              description: An array of JSON objects with section icon data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetAllSectionIconsResponse'
 *          404:
 *              description: Section icons were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SectionIconsNotFoundErrorResponse'
 *          500:
 *              description: Error fetching section icons because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getSectionIcons);

export default router;
