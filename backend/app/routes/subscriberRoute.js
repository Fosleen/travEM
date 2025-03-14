import { Router } from "express";
import controller from "../controllers/subscriberController.js";

const router = new Router();

router.get("/", controller.getSubscribers);
router.post("/", controller.addSubscriber);
router.get("/no-pagination", controller.getSubscribersNoPagination);

router.delete("/:id", controller.deleteSubscriber);

router.post("/send-newsletter", controller.sendNewsletter);

// GET /api/v1/subscribers/new-subscribers-previous-period

/**
 * @openapi
 *  '/api/v1/subscribers/new-subscribers-previous-period':
 *  get:
 *      summary: Get subscriber statistics
 *      tags:
 *        - Subscribers
 *      description: Returns statistics about number of new subscribers in last 30, 7 and 3 days and 24 hours.
 *      responses:
 *          200:
 *              description: A JSON object with data about number of new subscribers in previous period of time.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SubscriberStats'
 *          404:
 *              description: Subscriber data not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SubscribersNotFoundResponse'
 *          500:
 *              description: Error fetching subscriber data because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get(
  "/new-subscribers-previous-period",
  controller.getNewSubscribersInPreviousPeriod
);

export default router;
