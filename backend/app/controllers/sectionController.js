import service from "../services/sectionService.js";

class SectionController {
  async addSection(req, res) {
    const response = await service.addSection(
      req.body.text,
      req.body.order,
      req.body.subtitle,
      req.body.link_title,
      req.body.link_url,
      req.body.icon_url,
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
      req.body.icon_url,
      req.body.article_id
    );
    if (response.length == 0) {
      res.status(500).json({ error: `Error updating section ${id}` });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new SectionController();
