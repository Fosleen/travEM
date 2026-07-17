import service from "../services/countryLanguageService.js";

class CountryLanguageController {
  async getByCountryId(req, res) {
    const { countryId } = req.params;
    const includeInactive = req.query.includeInactive === "true";

    const response = await service.getByCountryId(countryId, includeInactive);

    if (!response) {
      // Language data is optional for a country. Return a successful empty
      // result so public pages can omit the block without producing a 404.
      res.status(200).json(null);
    } else {
      res.status(200).json(response);
    }
  }

  async add(req, res) {
    const response = await service.add(req.body);

    if (!response) {
      res.status(500).json({
        error: "Country language could not be created.",
      });
      return;
    }

    if (response.error) {
      res.status(400).json({
        error: response.error,
      });
      return;
    }

    res.status(201).json(response);
  }

  async patch(req, res) {
    const { id } = req.params;

    const response = await service.patch(id, req.body);

    if (!response) {
      res.status(500).json({
        error: "Country language could not be updated.",
      });
      return;
    }

    if (response.error) {
      res.status(404).json({
        error: response.error,
      });
      return;
    }

    res.status(200).json(response);
  }
}

export default new CountryLanguageController();
