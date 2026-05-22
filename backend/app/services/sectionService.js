import db from "../models/index.js";

class SectionService {
  async addSection(
    text,
    order,
    subtitle,
    link_title,
    link_url,
    section_icon_id,
    article_id,
    show_visa_info = false,
    show_best_time_to_visit = false
  ) {
    try {
      const section = await db.models.Section.create({
        text: text,
        order: order,
        subtitle: subtitle,
        link_title: link_title,
        link_url: link_url,
        sectionIconId: section_icon_id,
        articleId: article_id,
        show_visa_info: Boolean(show_visa_info),
        show_best_time_to_visit: Boolean(show_best_time_to_visit),
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
    section_icon_id,
    article_id,
    show_visa_info = false,
    show_best_time_to_visit = false
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
          sectionIconId: section_icon_id,
          articleId: article_id,
          show_visa_info: Boolean(show_visa_info),
          show_best_time_to_visit: Boolean(show_best_time_to_visit),
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