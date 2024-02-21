import service from "../services/specificityItemService.js";

class SectionImagesController {
  async getSpecificityItemById(req, res) {
    const { id } = req.params;
    const response = await service.getSpecificityItemById(id);
    if (!response || response.length == 0) {
      res.status(404).json({ error: `No specificity item found by id ${id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async addSpecificityItem(req, res) {
    const response = await service.addSpecificityItem(
      req.body.title,
      req.body.description,
      req.body.specificity_id
    );
    console.log(response.toJSON());

    if (response == undefined) {
      res.status(500).json({ error: `Error inserting specificity item` });
    } else {
      res.status(200).json(response);
    }
  }

  async patchSpecificityItem(req, res) {
    const response = await service.patchSpecificityItem(
      req.params.id,
      req.body.title,
      req.body.description,
      req.body.specificity_id
    );
    if (response.length == 0) {
      res.status(500).json({
        error: `Error updating specificity item with ${id}`,
      });
    } else {
      res.status(200).json(response);
    }
  }

  async deleteSpecificityItem(req, res) {
    const { id } = req.params;
    const response = await service.deleteSpecificityItem(id);
    if (response) {
      res.status(200).json({});
    } else {
      res
        .status(500)
        .json({ error: `Error while deleting specificity item with id ${id}` });
    }
  }
}

export default new SectionImagesController();
