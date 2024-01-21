import service from "../services/videoService.js";

class VideoController {
  async getVideos(req, res) {
    const response = await service.getVideos();
    if (response == undefined) {
      res.status(404).json({ error: "No video icons found" });
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
}

export default new VideoController();
