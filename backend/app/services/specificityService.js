import db from "../models/index.js";

class SpecificityService {
  async addSpecificities(title, country_id) {
    try {
      const specificity = await db.models.Specificity.create({
        title: title,
        countryId: country_id,
      });

      return specificity;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async patchSpecificities(id, title, country_id, items, images) {
    try {
      await db.models.Specificity.update(
        {
          title: title,
          countryId: country_id,
        },
        {
          where: { id: id },
        }
      );

      console.log(images);

      for (const el of items) {
        await db.models.SpecificityItem.update(
          { title: el.title, description: el.description },
          { where: { id: el.id } }
        );
      }

      for (const el of images) {
        await db.models.SpecificityImage.update(
          { url: el.url },
          { where: { id: el.id } }
        );
      }

      const updatedSpecificity = await db.models.Specificity.findByPk(id, {
        include: [
          { model: db.models.SpecificityImage },
          { model: db.models.SpecificityItem },
        ],
      });
      return updatedSpecificity;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new SpecificityService();
