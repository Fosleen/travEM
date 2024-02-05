import service from "../services/videoService.js";

class VideoController {
  async getVideos(req, res) {
    const response = await service.getVideos();
    if (response == undefined) {
      res.status(404).json({ error: "No videos found" });
    } else {
      res.status(200).json(response);
    }
  }

  async addVideo(req, res) {
    const response = await service.addVideo(
      req.body.url,
      req.body.article_id,
      req.body.place_id,
      req.body.country_id
    );

    if (response.length == 0) {
      res.status(500).json({ error: "Error inserting video" });
    } else {
      res.status(200).json(response);
    }
  }

  async patchVideo(req, res) {
    const response = await service.patchVideo(
      req.params.id,
      req.body.url,
      req.body.article_id,
      req.body.place_id,
      req.body.country_id
    );
    if (response.length == 0) {
      res.status(500).json({
        error: `Error updating video with ${id}`,
      });
    } else {
      res.status(200).json(response);
    }
  }

  async deleteVideo(req, res) {
    const { id } = req.params;
    const response = await service.deleteVideo(id);
    if (response) {
      res.status(200).json({});
    } else {
      res
        .status(500)
        .json({ error: `Error while deleting video with id ${id}` });
    }
  }
}

export default new VideoController();
