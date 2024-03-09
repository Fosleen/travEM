import { Router } from "express";
import controller from "../controllers/footerController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/footer
/**
 * @openapi
 *  '/api/v1/footer':
 *  get:
 *      summary: Get all data about footer (url of footer image)
 *      tags:
 *          - Footer
 *      description: Returns an object with id (always 1) and footer image_url.
 *      responses:
 *          200:
 *              description: An object with footer data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetFooterResponse'
 *          404:
 *              description: Footer was not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/FooterNotFoundErrorResponse'
 *          500:
 *              description: Error fetching footer because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getFooter);

// PATCH /api/v1/footer
/**
 * @openapi
 *  '/api/v1/footer':
 *  patch:
 *      summary: Update a footer or parts of it
 *      tags:
 *          - Footer
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateFooterBody'
 *      responses:
 *          200:
 *              description: The footer was successfully updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateFooterResponse'
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          404:
 *              description: Footer was not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/FooterNotFoundErrorResponse'
 *          500:
 *              description: Error updating footer because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.patch("/", verifyToken, controller.patchFooter);

export default router;
