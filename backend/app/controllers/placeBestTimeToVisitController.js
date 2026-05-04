import service from "../services/placeBestTimeToVisitService.js";

class PlaceBestTimeToVisitController {
  async getBySlug(req, res) {
    const { slug } = req.params;

    const response = await service.getBySlug(slug);

    if (!response) {
      res.status(404).json({
        error: `No best time to visit data found for slug ${slug}`,
      });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new PlaceBestTimeToVisitController();