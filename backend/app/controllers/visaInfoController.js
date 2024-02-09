import service from "../services/visaInfoService.js";

class VisaInfoController {
  async getVisaInfoById(req, res) {
    const { id } = req.params;
    const response = await service.getVisaInfoById(id);
    if (!response || response.length == 0) {
      res.status(404).json({ error: `No visa info found by id ${id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async getVisaInfoByCountries(req, res) {
    const response = await service.getVisaInfoByCountries(
      req.query.country1,
      req.query.country2
    );
    console.log(response);
    res.status(200).json(response);
  }

  async addVisaInfo(req, res) {
    const response = await service.addVisaInfo(
      req.body.id_country_info,
      req.body.documentation,
      req.body.visa_needed,
      req.body.additional_info,
      req.body.country_id
    );

    console.log(response.toJSON());

    if (response == undefined) {
      res
        .status(500)
        .json({ error: `Error inserting visa info for country ${country_id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async patchVisaInfo(req, res) {
    const response = await service.patchVisaInfo(
      req.params.id,
      req.body.id_country_info,
      req.body.documentation,
      req.body.visa_needed,
      req.body.additional_info,
      req.body.country_id
    );
    if (response.length == 0) {
      res.status(500).json({
        error: `Error updating visa info with ${id}`,
      });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new VisaInfoController();
