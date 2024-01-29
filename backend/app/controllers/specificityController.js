import specificityService from "../services/specificityService.js";
import specificityItemService from "../services/specificityItemService.js";
import specificityImageService from "../services/specificityImageService.js";

class SpecificityController {
  async addSpecificities(req, res) {
    try {
      const responseSpecificity = await specificityService.addSpecificities(
        req.body.title,
        req.body.country_id
      );

      const items = req.body.items;
      const images = req.body.images;

      const newItems = [];
      const newImages = [];

      for (const el of items) {
        const responseItem = await specificityItemService.addSpecificityItem(
          el.title,
          el.description,
          responseSpecificity.id
        );
        newItems.push(responseItem);
      }

      for (const el of images) {
        const responseImage = await specificityImageService.addSpecificityImage(
          el,
          responseSpecificity.id
        );
        newImages.push(responseImage);
      }

      console.log(responseSpecificity.toJSON());

      res.status(200).json({
        specificity: responseSpecificity,
        newItems: newItems,
        newImages: newImages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: `Error inserting specificities for country ${req.body.country_id}`,
      });
    }
  }
}

export default new SpecificityController();
