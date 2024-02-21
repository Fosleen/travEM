import service from "../services/specificityImageService.js";

class SectionImagesController {
  async getSpecificityImageById(req, res) {
    const { id } = req.params;
    const response = await service.getSpecificityImageById(id);
    if (!response || response.length == 0) {
      res.status(404).json({ error: `No specificity image found by id ${id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async addSpecificityImage(req, res) {
    const response = await service.addSpecificityImage(
      req.body.url,
      req.body.specificity_id
    );
    console.log(response.toJSON());

    if (response == undefined) {
      res.status(500).json({ error: `Error inserting specificity image` });
    } else {
      res.status(200).json(response);
    }
  }

  async patchSpecificityImage(req, res) {
    const response = await service.patchSpecificityImage(
      req.params.id,
      req.body.url,
      req.body.specificity_id
    );
    if (response.length == 0) {
      res.status(500).json({
        error: `Error updating specificity image with ${id}`,
      });
    } else {
      res.status(200).json(response);
    }
  }

  async deleteSpecificityImage(req, res) {
    const { id } = req.params;
    const response = await service.deleteSpecificityImage(id);
    if (response) {
      res.status(200).json({});
    } else {
      res
        .status(500)
        .json({ error: `Error while deleting specificity image with id ${id}` });
    }
  }
}

export default new SectionImagesController();
