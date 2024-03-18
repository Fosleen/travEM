import { Router } from "express";
import controller from "../controllers/videoController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/videos

/**
 * @openapi
 *  '/api/v1/videos':
 *  get:
 *      summary: Get all videos
 *      tags:
 *          - Video
 *      description: Returns an array of videos
 *      responses:
 *          200:
 *              description: An array of JSON objects with video data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VideoResponse'
 *          404:
 *              description: videos were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/videosNotFoundErrorResponse'
 *          500:
 *              description: Error fetching videos because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getVideos);

// POST /api/v1/videos

/**
 * @openapi
 *  '/api/v1/videos':
 *  post:
 *      summary: Add a new video for article
 *      tags:
 *          - Video
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/VideoResponse'
 *      responses:
 *          200:
 *              description: The video was added
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VideoResponse'
 *
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *
 */
router.post("/", verifyToken, controller.addVideo);

// PATCH /api/v1/videos/4

/**
 * @openapi
 *  '/api/v1/videos/{id}':
 *  patch:
 *      summary: Edit a video in section
 *      tags:
 *          - Video
 *      description: Edit video in corresponding section.
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/VideoResponse'
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
 *                          $ref: '#/components/schemas/VideoResponse'
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
router.patch("/:id", verifyToken, controller.patchVideo);

// DELETE /api/v1/videos/4

/**
 * @openapi
 *  '/api/v1/videos/{id}':
 *  delete:
 *      summary: Deletes a video
 *      tags:
 *          - Video
 *      description: Delete a video with provided id.
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
 *              description: Video with provided id was deleted.
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
 *              description: Video with the provided id was not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VideosNotFoundErrorResponse'

 *          500:
 *              description: Error inserting section image because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.delete("/:id", verifyToken, controller.deleteVideo);

export default router;
