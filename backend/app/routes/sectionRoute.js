import { Router } from "express";
import controller from "../controllers/sectionController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// POST /api/v1/sections

/**
 * @openapi
 *  '/api/v1/sections':
 *  post:
 *      summary: Add section to an article
 *      tags:
 *          - Section 
 *      description: Adds section to corresponding article.
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SectionBody'
 *      responses:
 *          200:
 *              description: An object with created section.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SectionBody'

 *          500:
 *              description: Error inserting section because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.post("/", verifyToken, controller.addSection);

// PATCH /api/v1/sections/4

/**
 * @openapi
 *  '/api/v1/sections/{id}':
 *  patch:
 *      summary: Update a section or parts of it
 *      tags:
 *          - Section
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateArticleParams'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateSectionBody'
 *      responses:
 *          200:
 *              description: Section was successfully updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateSectionBody'
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          404:
 *              description: Section with the provided id was not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ArticleNotFoundErrorResponse'
 *          500:
 *              description: Error updating article because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.patch("/:id", verifyToken, controller.patchSection);

// DELETE /api/v1/sections/4

/**
 * @openapi
 *  '/api/v1/sections/{id}':
 *  delete:
 *      summary: Delete section by id
 *      tags:
 *          - Section
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/DeleteArticleParams'
 *      responses:
 *          200:
 *              description: Section was successfully deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteResponse'
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          500:
 *              description: Error deleting section because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 *
 */
router.delete("/:id", verifyToken, controller.deleteSection);

export default router;
