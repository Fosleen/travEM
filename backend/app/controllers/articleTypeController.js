import service from "../services/articleTypeService.js";

class ArticleTypeController {
  async getArticleTypes(req, res) {
    const response = await service.getArticleTypes();
    if (response == undefined) {
      res.status(404).json({ error: "No article types found" });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new ArticleTypeController();
