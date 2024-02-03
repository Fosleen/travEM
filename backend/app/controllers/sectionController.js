import service from "../services/sectionService.js";

class SectionController {
  async addSection(req, res) {
    const response = await service.addSection(
      req.body.text,
      req.body.order,
      req.body.subtitle,
      req.body.link_title,
      req.body.link_url,
      req.body.section_icon_id,
      req.body.article_id
    );

    if (response.length == 0) {
      res.status(500).json({ error: "Error inserting section" });
    } else {
      res.status(200).json(response);
    }
  }

  async patchSection(req, res) {
    const response = await service.patchSection(
      req.params.id,
      req.body.text,
      req.body.order,
      req.body.subtitle,
      req.body.link_title,
      req.body.link_url,
      req.body.section_icon_id,
      req.body.article_id
    );
    if (response.length == 0) {
      res.status(500).json({ error: `Error updating section ${id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async deleteSection(req, res) {
    const { id } = req.params;
    const response = await service.deleteSection(id);
    if (response) {
      res.status(200).json({});
    } else {
      res
        .status(500)
        .json({ error: `Error while deleting section with id ${id}` });
    }
  }
}

export default new SectionController();
