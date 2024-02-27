import service from "../services/sectionImageService.js";

class SectionImagesController {
  async addSectionImage(req, res) {
    const response = await service.addSectionImage(
      req.body.url,
      req.body.section_id,
      req.body.width,
      req.body.height
    );

    if (response.length == 0) {
      res.status(500).json({ error: "Error inserting section image" });
    } else {
      res.status(200).json(response);
    }
  }

  async patchSectionImage(req, res) {
    const response = await service.patchSectionImage(
      req.body.url,
      req.params.id,
      req.body.width,
      req.body.height
    );
    if (response.length == 0) {
      res.status(500).json({ error: "Error updating section image" });
    } else {
      res.status(200).json(response);
    }
  }

  async deleteSectionImage(req, res) {
    const { id } = req.params;
    const response = await service.deleteSectionImage(id);
    if (response) {
      res.status(200).json({});
    } else {
      res
        .status(500)
        .json({ error: `Error while deleting section image with id ${id}` });
    }
  }
}

export default new SectionImagesController();
