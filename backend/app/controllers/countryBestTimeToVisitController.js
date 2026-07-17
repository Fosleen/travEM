import service from "../services/countryBestTimeToVisitService.js";

class CountryBestTimeToVisitController {
  async getBySlug(req, res) {
    const { slug } = req.params;

    const response = await service.getBySlug(slug);

    if (!response) {
      res.status(404).json({
        error: `No best time to visit data found for country slug ${slug}`,
      });
    } else {
      res.status(200).json(response);
    }
  }

  async getByCountryId(req, res) {
    const { countryId } = req.params;

    const response = await service.getByCountryId(countryId);

    if (!response) {
      res.status(404).json({
        error: `No best time to visit data found for country id ${countryId}`,
      });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new CountryBestTimeToVisitController();