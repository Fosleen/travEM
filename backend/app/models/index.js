import dbConfig from "../config/db-config.js";
import { Sequelize } from "sequelize";
import User from "./user.js";
import ArticleType from "./articleType.js";
import Article from "./article.js";
import SectionImage from "./sectionImage.js";
import Section from "./section.js";
import GalleryImage from "./galleryImage.js";
import Place from "./place.js";
import Country from "./country.js";
import Video from "./video.js";
import Specificity from "./specificity.js";
import SpecificityItem from "./specificityItem.js";
import SpecificityImage from "./specificityImage.js";
import Footer from "./footer.js";
import Homepage from "./homepage.js";
import Color from "./color.js";
import Continent from "./continent.js";
import Characteristic from "./characteristic.js";
import CharacteristicIcon from "./characteristicIcon.js";
import ArticleSpecialType from "./articleSpecialType.js";
import article_articleSpecialType from "./article_articleSpecialType.js";
import SectionIcon from "./sectionIcon.js";
import VisaInfo from "./visaInfo.js";
import sequelizeConnection from "../sequelize.js";
import AirportCity from "./airportCity.js";
import Subscriber from "./subscriber.js";

const db = {};

db.sequelize = sequelizeConnection;
db.models = {};
db.models.User = User(sequelizeConnection, Sequelize.DataTypes);
db.models.ArticleType = ArticleType(sequelizeConnection, Sequelize.DataTypes);
db.models.Article = Article(sequelizeConnection, Sequelize.DataTypes);
db.models.SectionImage = SectionImage(sequelizeConnection, Sequelize.DataTypes);
db.models.SectionIcon = SectionIcon(sequelizeConnection, Sequelize.DataTypes);
db.models.Section = Section(sequelizeConnection, Sequelize.DataTypes);
db.models.GalleryImage = GalleryImage(sequelizeConnection, Sequelize.DataTypes);
db.models.Place = Place(sequelizeConnection, Sequelize.DataTypes);
db.models.Country = Country(sequelizeConnection, Sequelize.DataTypes);
db.models.Video = Video(sequelizeConnection, Sequelize.DataTypes);
db.models.Specificity = Specificity(sequelizeConnection, Sequelize.DataTypes);
db.models.SpecificityImage = SpecificityImage(
  sequelizeConnection,
  Sequelize.DataTypes
);
db.models.SpecificityItem = SpecificityItem(
  sequelizeConnection,
  Sequelize.DataTypes
);
db.models.Footer = Footer(sequelizeConnection, Sequelize.DataTypes);
db.models.Homepage = Homepage(sequelizeConnection, Sequelize.DataTypes);
db.models.Color = Color(sequelizeConnection, Sequelize.DataTypes);
db.models.Continent = Continent(sequelizeConnection, Sequelize.DataTypes);
db.models.Characteristic = Characteristic(
  sequelizeConnection,
  Sequelize.DataTypes
);
db.models.VisaInfo = VisaInfo(sequelizeConnection, Sequelize.DataTypes);
db.models.CharacteristicIcon = CharacteristicIcon(
  sequelizeConnection,
  Sequelize.DataTypes
);

db.models.ArticleSpecialType = ArticleSpecialType(
  sequelizeConnection,
  Sequelize.DataTypes
);

db.models.AirportCity = AirportCity(sequelizeConnection, Sequelize.DataTypes);

db.models.Subscriber = Subscriber(sequelizeConnection, Sequelize.DataTypes);

db.models.Article_ArticleSpecialType =
  article_articleSpecialType(sequelizeConnection);

// Export the db object after all models are initialized

export default db;
