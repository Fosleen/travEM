import { Router } from "express";
import controller from "../controllers/articleController.js";
import { verifyToken } from "../middleware/jwt_verify.js";

const router = new Router();

// GET /api/v1/articles?page=1&pageSize=12&articleType=1
/**
 * @openapi
 *  '/api/v1/articles':
 *  get:
 *      summary: Get all articles
 *      tags:
 *          - Article
 *      description: Returns an object with an array of articles with basic info about articles - id, title, subtitle, description, main_image_url, date_written, articleTypeId, countryId, placeId, userId, airportCityId and objects with data about article_type, airport_city, country and place.
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            example: 1
 *          description: "Page number for pagination (default: 1)"
 *        - in: query
 *          name: pageSize
 *          schema:
 *            type: integer
 *            example: 12
 *          description: "Number of items per page (default: 12)"
 *        - in: query
 *          name: articleType
 *          schema:
 *            type: integer
 *            example: 1
 *          description: Filter articles by type (optional)
 *      responses:
 *          200:
 *              description: An array of JSON objects with article data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetAllArticlesResponse'
 *          404:
 *              description: Articles were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ArticlesNotFoundErrorResponse'
 *          500:
 *              description: Error fetching articles because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", controller.getArticles);

// GET /api/v1/articles/homepage
router.get("/homepage", controller.getHomepageArticles);

// GET /api/v1/articles/recommended/1?type=article
/**
 * @openapi
 *  '/api/v1/articles/recommended/{id}':
 *  get:
 *      summary: Get 4 recommended articles with basic info about them.
 *      tags:
 *          - Article
 *      description: 'Returns an array of objects with data about articles that are somehow connected to the article which id is being passed as a parameter. It returns always 4 articles. If the passed type is article and the article with that id is destination and if it has place not null - return 2 articles with the same place (this article excluded)(if they exist). If that article has country, return 2 articles from the same country (if they exist, these already added articles excluded). If the selected destination article has not place, but has country - return 4 articles that are about the same country (if exist). If passed article id is not destination it must be plane tickets or tips and tricks. In that case return 4 articles of the same article type (if exist). If the article is of plane tickets type - return 4 newest articles about plane tickets. If article type is one out of 6 possible tips and tricks groups (ids from 3 to 8) - return 4 random articles from the same article type group. If the passed string page is not article, but the type is country-page or place-page, then find 2 articles that are about same country as the first result (if exist). Otherwise (if some articles do not exist and final total number of articles is not 4), add random destination articles until the total number of returned recommended articles (without repeating already added articles in all cases) is not 4.'
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: integer
 *              example: 3
 *          description: "Id of article for which are recommended articles being fetched"
 *        - in: query
 *          name: type
 *          schema:
 *              type: string
 *              example: article
 *          description: "Type of page which needs recommended articles (allowed options: article, country-page, place-page)"
 *      responses:
 *          200:
 *              description: An array of JSON objects with article data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetArticlesResponse'
 *          404:
 *              description: Recommended articles for article of that type or for article with that id were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RecommendedArticlesNotFoundErrorResponse'
 *          500:
 *              description: Error fetching articles because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/recommended/:id", controller.getRecommendedArticles);

// GET /api/v1/articles/country/top/1
/**
 * @openapi
 *  '/api/v1/articles/country/top/{id}':
 *  get:
 *      summary: Get top country article
 *      tags:
 *          - Article
 *      description: "Returns an object with data about an article that is marked as the top one for country by country's id."
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: integer
 *              example: 2
 *          description: "Id of country for which is top article being fetched"
 *      responses:
 *          200:
 *              description: A JSON object with article data or top country article for that country was not found (does not exist yet).
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetTopCountryArticleResponse'
 *          500:
 *              description: Error fetching articles because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/country/top/:id", controller.getTopCountryArticle);

// GET /api/v1/articles/country/1
/**
 * @openapi
 *  '/api/v1/articles/country/{id}':
 *  get:
 *      summary: Get all articles for a country
 *      tags:
 *          - Article
 *      description: "Returns an array with objects with data about articles that belong to some country by country's id"
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: integer
 *              example: 1
 *          description: Id of country for which are articles being fetched
 *      responses:
 *          200:
 *              description: An array with JSON objects with article data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetArticlesByDestinationResponse'
 *          404:
 *              description: Articles for that country were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CountryArticlesNotFoundErrorResponse'
 *          500:
 *              description: Error fetching articles because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/country/:id", controller.getArticlesByCountryId);

// GET /api/v1/articles/place/1
/**
 * @openapi
 *  '/api/v1/articles/place/{id}':
 *  get:
 *      summary: Get all articles for a place
 *      tags:
 *          - Article
 *      description: "Returns an array with objects with data about articles that belong to some place by place's id"
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: integer
 *              example: 1
 *          description: Id of place for which are articles being fetched
 *      responses:
 *          200:
 *              description: An array with JSON objects with article data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetArticlesByDestinationResponse'
 *          404:
 *              description: Articles for that place were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PlaceArticlesNotFoundErrorResponse'
 *          500:
 *              description: Error fetching articles because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/place/:id", controller.getArticlesByPlaceId);

// GET /api/v1/articles/search/zagr?page=1&pageSize=12
/**
 * @openapi
 *  '/api/v1/articles/search/{name}':
 *  get:
 *      summary: Get all articles by name (search articles by name)
 *      tags:
 *          - Article
 *      description: Returns an object with an array of articles that start with inserted string value (article title) and with basic info about those articles.
 *      parameters:
 *        - in: path
 *          name: name
 *          schema:
 *            type: string
 *            example: test
 *          description: "Textual value by which articles return if the article name starts with it"
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            example: 1
 *          description: "Page number for pagination (default: 1)"
 *        - in: query
 *          name: pageSize
 *          schema:
 *            type: integer
 *            example: 200
 *          description: "Number of items per page (default: 200)"
 *      responses:
 *          200:
 *              description: An array of JSON objects with article data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetAllArticlesResponse'
 *          404:
 *              description: Articles starting with searched text value were not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ArticlesNotFoundSearchedErrorResponse'
 *          500:
 *              description: Error fetching articles because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/search/:name", controller.getArticleByName);

// GET /api/v1/articles/1
/**
 * @openapi
 *  '/api/v1/articles/{id}':
 *  get:
 *      summary: Get article by id
 *      tags:
 *          - Article
 *      description: Returns an object with all data about an article by its id.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            example: 1
 *          description: "Id of article that is being fetched"
 *      responses:
 *          200:
 *              description: A JSON object with article data.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetArticleByIdResponse'
 *          404:
 *              description: Article with provided id was not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ArticleNotFoundErrorResponse'
 *          500:
 *              description: Error fetching articles because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/:id", controller.getArticleById);

// POST /api/v1/articles
/**
 * @openapi
 *  '/api/v1/articles':
 *  post:
 *      summary: Add a new article
 *      tags:
 *          - Article
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddArticleBody'
 *      responses:
 *          200:
 *              description: The article was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AddArticleResponse'
 *          400:
 *              description: Client sent bad request (wrong body format)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ArticleInsertingErrorResponse'
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          500:
 *              description: Error inserting article because of server
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ServerErrorResponse'
 *
 */
router.post("/", verifyToken, controller.addArticle);

// PATCH /api/v1/articles/4
/**
 * @openapi
 *  '/api/v1/articles/{id}':
 *  patch:
 *      summary: Update an article or parts of it
 *      tags:
 *          - Article
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
 *                      $ref: '#/components/schemas/AddArticleBody'
 *      responses:
 *          200:
 *              description: The article was successfully updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AddArticleResponse'
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          404:
 *              description: Article with the provided id was not found
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
router.patch("/:id", verifyToken, controller.patchArticle);

// PUT /api/v1/articles/country/top
/**
 * @openapi
 *  '/api/v1/articles/country/top':
 *  put:
 *      summary: Update or create a top article for a country
 *      description: Update or create a top country article, based on countryId of selected article. If that country already has top article, replace it with new one. If it has not a top article, this one will become it.
 *      tags:
 *          - Article
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateTopCountryArticleBody'
 *      responses:
 *          200:
 *              description: The top country article article was successfully created or updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateTopCountryArticleResponse'
 *          401:
 *              description: Request needs authentication credential (Bearer token missing)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/NotAuthorisedResponse'
 *          404:
 *              description: Article with the provided id was not found or it does not belong to any country.
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
router.put(
  "/country/top",
  verifyToken,
  controller.updateOrCreateTopCountryArticle
);

// PUT /api/v1/articles/homepage/1
router.put(
  "/homepage/:specialTypeId",
  verifyToken,
  controller.updateOrCreateTopHomepageArticles // update articles on any homepage part
);

// DELETE /api/v1/articles/4
/**
 * @openapi
 *  '/api/v1/articles/{id}':
 *  delete:
 *      summary: Delete an article by id
 *      tags:
 *          - Article
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
 *              description: The article was successfully deleted
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
router.delete("/:id", verifyToken, controller.deleteArticle);

// DELETE /api/v1/articles/country/top
/**
 * @openapi
 *  '/api/v1/articles/country/top/:id':
 *  delete:
 *      summary: Remove article from being top article for some country by article id
 *      tags:
 *          - Article
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
 *              description: The article as top country article was successfully removed.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteResponse'
 */
router.delete(
  "/country/top/:id",
  verifyToken,
  controller.deleteTopCountryArticle
);

export default router;
