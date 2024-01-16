import db from "../models/index.js";

class SectionService {
  async addSection(
    text,
    order,
    subtitle,
    link_title,
    link_url,
    icon_url,
    article_id
  ) {
    try {
      const section = await db.models.Section.create({
        text: text,
        order: order,
        subtitle: subtitle,
        link_title: link_title,
        link_url: link_url,
        icon_url: icon_url,
        articleId: article_id,
      });
      return section;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async patchSection(
    id,
    text,
    order,
    subtitle,
    link_title,
    link_url,
    icon_url,
    article_id
  ) {
    console.log(id);

    try {
      await db.models.Section.update(
        {
          text: text,
          order: order,
          subtitle: subtitle,
          link_title: link_title,
          link_url: link_url,
          icon_url: icon_url,
          articleId: article_id,
        },
        {
          where: { id: id },
        }
      );

      const updatedSection = await db.models.Section.findByPk(id);
      return updatedSection;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteSection(id) {
    try {
      await db.models.Section.destroy({
        where: { id: id },
      });

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new SectionService();
