import db from "../models/index.js";

class FooterService {
  async getFooter() {
    try {
      const Footer = await db.models.Footer.findOne();
      return Footer;
    } catch (error) {
      return [];
    }
  }

  async patchFooter(image_url) {
    try {
      await db.models.Footer.update(
        {
          image_url: image_url,
        },
        {
          returning: true,
          where: { id: 1 }, // there will always be only one row in footer table
        }
      );

      const updatedFooter = await db.models.Footer.findByPk(1);
      return updatedFooter;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new FooterService();
