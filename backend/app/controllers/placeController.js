import service from "../services/placeService.js";

class PlacesController {
  async getFavoritePlaces(req, res) {
    const response = await service.getFavoritePlaces();
    if (response == undefined) {
      res.status(404).json({ error: "No favorite places found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getPlaces(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;

    const response = await service.getPlaces(page, pageSize);

    if (response.data.length === 0) {
      res.status(404).json({ error: "No places found" });
    } else {
      res.status(200).json(response);
    }
  }

  async getPlaceById(req, res) {
    const { id } = req.params;
    const response = await service.getPlaceById(id);
    if (!response || response.length == 0) {
      res.status(404).json({ error: `No place found by id ${id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async getPlaceByName(req, res) {
    const { name } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 200;

    const response = await service.getPlaceByName(name, page, pageSize);
    if (!response || response.length == 0) {
      res.status(404).json({ error: `No place found by name ${name}` });
    } else {
      res.status(200).json(response);
    }
  }

  async addPlace(req, res) {
    const response = await service.addPlace(
      req.body.name,
      req.body.description,
      req.body.main_image_url,
      req.body.map_icon,
      req.body.is_on_homepage_map,
      req.body.latitude,
      req.body.longitude,
      req.body.country_id
    );

    console.log(response.toJSON());

    if (response == undefined) {
      res.status(500).json({ error: "Error inserting place" });
    } else {
      res.status(200).json(response);
    }
  }

  async patchPlace(req, res) {
    const response = await service.patchPlace(
      req.params.id,
      req.body.name,
      req.body.description,
      req.body.main_image_url,
      req.body.map_icon,
      req.body.is_on_homepage_map,
      req.body.latitude,
      req.body.longitude,
      req.body.country_id
    );
    if (response.length == 0) {
      res.status(500).json({ error: `Error updating place ${id}` });
    } else {
      res.status(200).json(response);
    }
  }

  async deletePlaceAndArticles(req, res) {
    const { id } = req.params;
    const response = await service.deletePlaceAndArticles(id);
    if (response) {
      res.status(200).json({});
    } else {
      res
        .status(500)
        .json({ error: `Error while deleting place with id ${id}` });
    }
  }
}

export default new PlacesController();
