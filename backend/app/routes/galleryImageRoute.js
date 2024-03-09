import { Router } from "express";
import controller from "../controllers/galleryImageController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// POST /api/v1/gallery-images
/**
 * @openapi
 *  '/api/v1/gallery-images':
 *  post:
 *      summary: Add a new gallery image
 *      tags:
 *          - Gallery images
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddGalleryImageBody'
 *      responses:
 *          200:
 *              description: The gallery image was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AddGalleryImageResponse'
 *          400:
 *              description: Client sent bad request (wrong body format)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GalleryImagesInsertingErrorResponse'
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *
 */
router.post("/", verifyToken, controller.addGalleryImage);

// DELETE /api/v1/gallery-images/4
/**
 * @openapi
 *  '/api/v1/gallery-images/{id}':
 *  delete:
 *      summary: Delete gallery image by id
 *      tags:
 *          - Gallery images
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              $ref: '#/components/schemas/DeleteGalleryImageParams'
 *      responses:
 *          200:
 *              description: The gallery image was successfully deleted
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
 *              description: Error deleting gallery image because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 *
 */
router.delete("/:id", verifyToken, controller.deleteGalleryImage);

export default router;
