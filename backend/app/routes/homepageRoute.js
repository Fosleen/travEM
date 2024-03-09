import { Router } from "express";
import controller from "../controllers/homepageController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/homepage

/**
 * @openapi
 *  '/api/v1/homepage':
 *  get:
 *      summary: Get all data about homepage (hero image, banner info)
 *      tags:
 *          - Homepage
 *      description: Returns an object needed for homepage
 *      responses:
 *          200:
 *              description: An object with homepage data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetHomepageResponse'
 *          404:
 *              description: Homepage data was not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/HomepageNotFoundErrorResponse'
 *          500:
 *              description: Error fetching homepage data because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getHomepage);

// GET /api/v1/homepage/stats

/**
 * @openapi
 *  '/api/v1/homepage/stats':
 *  get:
 *      summary: Get all stats for homepage (number of visited countries, visited continents)
 *      tags:
 *          - Homepage
 *      description: Returns an object needed for homepage stats
 *      responses:
 *          200:
 *              description: An object with homepage stats.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetHomepageStatsResponse'
 *          404:
 *              description: Homepage stats data was not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/HomepageStatsNotFoundErrorResponse'
 *          500:
 *              description: Error fetching homepage data because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/stats", controller.getHomepageStats);

// PATCH /api/v1/homepage

/**
 * @openapi
 *  '/api/v1/homepage':
 *  patch:
 *      summary: Edit homepage banner data and homepage stats data
 *      tags:
 *          - Homepage
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/GetHomepageResponse'
 *      description: Returns an object with edited homepage data
 *      responses:
 *          200:
 *              description: An object with edited homepage stats.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetHomepageStatsResponse'
 *          404:
 *              description: Homepage stats data was not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/HomepageStatsNotFoundErrorResponse'
 *          500:
 *              description: Error fetching homepage data because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.patch("/", verifyToken, controller.patchHomepage);

export default router;
