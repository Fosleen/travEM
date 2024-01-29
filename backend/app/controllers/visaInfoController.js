import service from "../services/visaInfoService.js";

class VisaInfoController {
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
}

export default new VisaInfoController();
