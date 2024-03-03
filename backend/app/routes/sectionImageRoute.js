import { Router } from "express";
import controller from "../controllers/sectionImageController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// POST /api/v1/section-images

/**
 * @openapi
 *  '/api/v1/section-images':
 *  post:
 *      summary: Add section images to section
 *      tags:
 *          - Section image
 *      description: Adds image to corresponding section.
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SectionImage'
 *      responses:
 *          200:
 *              description: An object with created section image data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SectionImage'

 *          500:
 *              description: Error inserting section image because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.post("/", verifyToken, controller.addSectionImage);

// PATCH /api/v1/section-images/3

/**
 * @openapi
 *  '/api/v1/section-images/{id}':
 *  patch:
 *      summary: Add section images to section
 *      tags:
 *          - Section image
 *      description: Adds image to corresponding section.
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateSectionImageBody'
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateSectionImageParams'
 *      responses:
 *          200:
 *              description: An object with created section image data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SectionImage'
 * 
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          404:
 *              description: Section image with the provided id was not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SectionNotFoundErrorResponse'

 *          500:
 *              description: Error inserting section image because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.patch("/:id", verifyToken, controller.patchSectionImage);

// DELETE /api/v1/section-images/4

/**
 * @openapi
 *  '/api/v1/section-images/{id}':
 *  delete:
 *      summary: Delete section image by id
 *      tags:
 *          - Section image
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateSectionImageParams'
 *      responses:
 *          200:
 *              description: The section image was successfully deleted
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
 *              description: Error deleting article because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 *
 */
router.delete("/:id", verifyToken, controller.deleteSectionImage);

export default router;
