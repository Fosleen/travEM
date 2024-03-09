import { Router } from "express";
import controller from "../controllers/articleTypeController.js";

const router = new Router();

// GET /api/v1/article-types
/**
 * @openapi
 *  '/api/v1/article-types':
 *  get:
 *      summary: Get all article types
 *      tags:
 *          - Article type
 *      description: Returns an array of article types with id, name and description.
 *      responses:
 *          200:
 *              description: An array of JSON objects with article type data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetAllArticleTypesResponse'
 *          404:
 *              description: Article types were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ArticleTypesNotFoundErrorResponse'
 *          500:
 *              description: Error fetching article types because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getArticleTypes);

export default router;
