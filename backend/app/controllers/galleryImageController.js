import service from "../services/galleryImageService.js";

class GalleryImagesController {
  async addGalleryImage(req, res) {
    const response = await service.addGalleryImage(
      req.body.url,
      req.body.article_id,
      req.body.width,
      req.body.height
    );
    if (response.length == 0) {
      res.status(500).json({ error: "Error inserting gallery image" });
    } else {
      res.status(200).json(response);
    }
  }

  async deleteGalleryImage(req, res) {
    const { id } = req.params;
    const response = await service.deleteGalleryImage(id);
    if (response) {
      res.status(200).json({});
    } else {
      res
        .status(500)
        .json({ error: `Error while deleting gallery image with id ${id}` });
    }
  }
}

export default new GalleryImagesController();
