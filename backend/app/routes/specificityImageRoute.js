import { Router } from "express";
import controller from "../controllers/specificityImageController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/specificity-images/4

/**
 * @openapi
 *  '/api/v1/specificity-images/{id}':
 *  get:
 *      summary: Get specificity image with provided id
 *      tags:
 *          - Specificity image
 *      description: Returns specificity image with provided id.
 *
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateSectionImageParams'
 *      responses:
 *          200:
 *              description: Details of specificity image with given id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SpecificityImage'
 *          404:
 *              description: Specificity image with provided id was not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SpecificityImageNotFoundErrorResponse'
 *          500:
 *              description: Error fetching colors because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/:id", controller.getSpecificityImageById);

// POST /api/v1/specificity-images

/**
 * @openapi
 *  '/api/v1/specificity-images':
 *  post:
 *      summary: Add a new specificity image
 *      tags:
 *          - Specificity image
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddSpecificityImageBody'
 *      responses:
 *          200:
 *              description: Specificity image was successfully added
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetSpecificityImageResponse'
 *
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *
 */
router.post("/", verifyToken, controller.addSpecificityImage);

// PATCH /api/v1/specificity-images/4

/**
 * @openapi
 *  '/api/v1/specificity-images/{id}':
 *  patch:
 *      summary: Edit specificity image with given id
 *      tags:
 *          - Specificity image
 *      description: Change data of specificity image.
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddSpecificityImageBody'
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateSectionImageParams'
 *      responses:
 *          200:
 *              description: An object with updated specificity image data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SpecificityImage'
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
router.patch("/:id", verifyToken, controller.patchSpecificityImage);

// DELETE /api/v1/specificity-images/4

/**
 * @openapi
 *  '/api/v1/specificity-images/{id}':
 *  delete:
 *      summary: Delete specificity image with given id
 *      tags:
 *          - Specificity image
 *      description: Delete specificity image.
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
 *              description: Specificity image was successfully deleted
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
router.delete("/:id", verifyToken, controller.deleteSpecificityImage);

export default router;
