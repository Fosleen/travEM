import { Router } from "express";
import controller from "../controllers/specificityImageController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/specificity-images/4

/**
 * @openapi
 *  '/api/v1/specificity-images/{id}':
 *  get:
 *      summary: Get specifity image with provided id
 *      tags:
 *          - Specificity image
 *      description: Returns specifity image with provided id.
 *
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/UpdateSectionImageParams'
 *      responses:
 *          200:
 *              description: Details of specifity image with given id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SpecifityImage'
 *          404:
 *              description: Specifity image with provided id was not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SpecifityImageNotFoundErrorResponse'
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
 *      summary: Add a new specifity image
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
 *      summary: Edit specifity image with given id
 *      tags:
 *          - Specificity image
 *      description: Change data of specifity image.
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
 *              description: An object with updated specifity image data.
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
 *      summary: Delete specifity image with given id
 *      tags:
 *          - Specificity image
 *      description: Delete specifity image.
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
 *              description: Specifity image was successfully deleted
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
