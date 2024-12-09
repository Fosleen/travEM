import db from "../models/index.js";
class HomepageService {
  async getHomepage() {
    try {
      const homepages = await db.models.Homepage.findOne();
      return homepages;
    } catch (error) {
      return [];
    }
  }

  async getHomepageStats() {
    try {
      const continentsNmbr = await db.models.Continent.count();
      const countriesNmbr = await db.models.Country.count();
      const articlesNmbr = await db.models.Article.count();

      return {
        continents_nmbr: continentsNmbr,
        countries_nmbr: countriesNmbr,
        articles_nmbr: articlesNmbr,
      };
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async patchHomepage(
    hero_image_url,
    banner_title,
    banner_small_text,
    banner_description,
    button_text,
    flights_nmbr,
    videos_nmbr,
    distance_nmbr,
    banner_image_url,
    button_url
  ) {
    try {
      await db.models.Homepage.update(
        {
          hero_image_url: hero_image_url,
          banner_title: banner_title,
          banner_small_text: banner_small_text,
          banner_description: banner_description,
          button_text: button_text,
          flights_nmbr: flights_nmbr,
          videos_nmbr: videos_nmbr,
          distance_nmbr: distance_nmbr,
          banner_image_url: banner_image_url,
          button_url: button_url,
        },
        {
          returning: true,
          where: { id: 1 }, // there will always be only one row in homepage table
        }
      );

      const updatedHomepage = await db.models.Homepage.findByPk(1);
      return updatedHomepage;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new HomepageService();
