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
import FooterGroup from "./footerGroup.js";
import FooterItem from "./footerItem.js";
import Color from "./color.js";
import Continent from "./continent.js";
import Characteristic from "./characteristic.js";
import CharacteristicIcon from "./characteristicIcon.js";
import ArticleSpecialType from "./articleSpecialType.js";

const sequelize = new Sequelize(
  `${dbConfig.DIALECT}://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DATABASE}`
);

const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.User = User(sequelize, Sequelize.DataTypes);
db.models.ArticleType = ArticleType(sequelize, Sequelize.DataTypes);
db.models.Article = Article(sequelize, Sequelize.DataTypes);
db.models.SectionImage = SectionImage(sequelize, Sequelize.DataTypes);
db.models.Section = Section(sequelize, Sequelize.DataTypes);
db.models.GalleryImage = GalleryImage(sequelize, Sequelize.DataTypes);
db.models.Place = Place(sequelize, Sequelize.DataTypes);
db.models.Country = Country(sequelize, Sequelize.DataTypes);
db.models.Video = Video(sequelize, Sequelize.DataTypes);
db.models.Specificity = Specificity(sequelize, Sequelize.DataTypes);
db.models.SpecificityImage = SpecificityImage(sequelize, Sequelize.DataTypes);
db.models.SpecificityItem = SpecificityItem(sequelize, Sequelize.DataTypes);
db.models.Footer = Footer(sequelize, Sequelize.DataTypes);
db.models.Homepage = Homepage(sequelize, Sequelize.DataTypes);
db.models.Homepage = Homepage(sequelize, Sequelize.DataTypes);
db.models.FooterGroup = FooterGroup(sequelize, Sequelize.DataTypes);
db.models.FooterItem = FooterItem(sequelize, Sequelize.DataTypes);
db.models.Color = Color(sequelize, Sequelize.DataTypes);
db.models.Continent = Continent(sequelize, Sequelize.DataTypes);
db.models.Characteristic = Characteristic(sequelize, Sequelize.DataTypes);
db.models.CharacteristicIcon = CharacteristicIcon(
  sequelize,
  Sequelize.DataTypes
);

db.models.ArticleSpecialType = ArticleSpecialType(
  sequelize,
  Sequelize.DataTypes
);

export default db;
