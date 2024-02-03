import service from "../services/characteristicService.js";

class CharacteristicController {
  async addCharacteristic(req, res) {
    const response = await service.addCharacteristic(
      req.body.title,
      req.body.description,
      req.body.characteristic_icon_id,
      req.body.country_id
    );

    console.log(response.toJSON());

    if (response == undefined) {
      res.status(500).json({ error: "Error inserting characteristic" });
    } else {
      res.status(200).json(response);
    }
  }

  async patchCharacteristic(req, res) {
    const response = await service.patchCharacteristic(
      req.params.id,
      req.body.title,
      req.body.description,
      req.body.country_id,
      req.body.characteristic_icon_id
    );
    if (response.length == 0) {
      res
        .status(500)
        .json({ error: `Error updating characteristic with id ${id}` });
    } else {
      res.status(200).json(response);
    }
  }
}

export default new CharacteristicController();
