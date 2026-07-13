import dbConfig from "../config/db-config.js";
import { Sequelize } from "sequelize";
import User from "./user.js";
import ArticleType from "./articleType.js";
import Article from "./article.js";
import ArticleSchedule from "./articleSchedule.js";
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
import PlaceBestTimeToVisit from "./placeBestTimeToVisit.js";
import PlaceBestTimeToVisitMonth from "./placeBestTimeToVisitMonth.js";
import CountryBestTimeToVisit from "./countryBestTimeToVisit.js";
import CountryBestTimeToVisitRegion from "./countryBestTimeToVisitRegion.js";
import CountryBestTimeToVisitMonth from "./countryBestTimeToVisitMonth.js";
import CountryLanguage from "./countryLanguage.js";
import CountryLanguagePhrase from "./countryLanguagePhrase.js";
import ArticleComment from "./articleComment.js";
import ArticleCommentLike from "./articleCommentLike.js";
import AirplaneTicketPromo from "./airplaneTicketPromo.js";
import AffiliatePartner from "./affiliatePartner.js";
import ArticleAffiliateLink from "./articleAffiliateLink.js";

const db = {};

db.sequelize = sequelizeConnection;
db.models = {};

db.models.User = User(sequelizeConnection, Sequelize.DataTypes);
db.models.ArticleType = ArticleType(sequelizeConnection, Sequelize.DataTypes);
db.models.Article = Article(sequelizeConnection, Sequelize.DataTypes);
db.models.ArticleSchedule = ArticleSchedule(
  sequelizeConnection,
  Sequelize.DataTypes
);
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

db.models.PlaceBestTimeToVisit = PlaceBestTimeToVisit(
  sequelizeConnection,
  Sequelize.DataTypes
);

db.models.PlaceBestTimeToVisitMonth = PlaceBestTimeToVisitMonth(
  sequelizeConnection,
  Sequelize.DataTypes
);

db.models.CountryBestTimeToVisit = CountryBestTimeToVisit(
  sequelizeConnection,
  Sequelize.DataTypes
);

db.models.CountryBestTimeToVisitRegion = CountryBestTimeToVisitRegion(
  sequelizeConnection,
  Sequelize.DataTypes
);

db.models.CountryBestTimeToVisitMonth = CountryBestTimeToVisitMonth(
  sequelizeConnection,
  Sequelize.DataTypes
);

db.models.CountryLanguage = CountryLanguage(
  sequelizeConnection,
  Sequelize.DataTypes
);

db.models.CountryLanguagePhrase = CountryLanguagePhrase(
  sequelizeConnection,
  Sequelize.DataTypes
);
db.models.ArticleComment = ArticleComment(
  sequelizeConnection,
  Sequelize.DataTypes
);
db.models.ArticleCommentLike = ArticleCommentLike(
  sequelizeConnection,
  Sequelize.DataTypes
);
db.models.AirplaneTicketPromo = AirplaneTicketPromo(
  sequelizeConnection,
  Sequelize.DataTypes
);
db.models.AffiliatePartner = AffiliatePartner(
  sequelizeConnection,
  Sequelize.DataTypes
);
db.models.ArticleAffiliateLink = ArticleAffiliateLink(
  sequelizeConnection,
  Sequelize.DataTypes
);

db.models.Article_ArticleSpecialType =
  article_articleSpecialType(sequelizeConnection);

/**
 * Best time to visit associations - place
 */
db.models.Place.hasOne(db.models.PlaceBestTimeToVisit, {
  foreignKey: "place_id",
  as: "best_time_to_visit",
});

db.models.PlaceBestTimeToVisit.belongsTo(db.models.Place, {
  foreignKey: "place_id",
  as: "place",
});

db.models.PlaceBestTimeToVisit.hasMany(db.models.PlaceBestTimeToVisitMonth, {
  foreignKey: "place_best_time_to_visit_id",
  as: "months",
});

db.models.PlaceBestTimeToVisitMonth.belongsTo(db.models.PlaceBestTimeToVisit, {
  foreignKey: "place_best_time_to_visit_id",
  as: "best_time_to_visit",
});

/**
 * Best time to visit associations - country
 */
db.models.Country.hasOne(db.models.CountryBestTimeToVisit, {
  foreignKey: "country_id",
  as: "best_time_to_visit",
});

db.models.CountryBestTimeToVisit.belongsTo(db.models.Country, {
  foreignKey: "country_id",
  as: "country",
});

db.models.CountryBestTimeToVisit.hasMany(
  db.models.CountryBestTimeToVisitRegion,
  {
    foreignKey: "country_best_time_to_visit_id",
    as: "regions",
  }
);

db.models.CountryBestTimeToVisitRegion.belongsTo(
  db.models.CountryBestTimeToVisit,
  {
    foreignKey: "country_best_time_to_visit_id",
    as: "best_time_to_visit",
  }
);

db.models.CountryBestTimeToVisitRegion.hasMany(
  db.models.CountryBestTimeToVisitMonth,
  {
    foreignKey: "country_best_time_to_visit_region_id",
    as: "months",
  }
);

db.models.CountryBestTimeToVisitMonth.belongsTo(
  db.models.CountryBestTimeToVisitRegion,
  {
    foreignKey: "country_best_time_to_visit_region_id",
    as: "region",
  }
);

/**
 * Country language associations
 */
db.models.Country.hasOne(db.models.CountryLanguage, {
  foreignKey: "countryId",
  as: "language",
});

db.models.CountryLanguage.belongsTo(db.models.Country, {
  foreignKey: "countryId",
  as: "country",
});

db.models.CountryLanguage.hasMany(db.models.CountryLanguagePhrase, {
  foreignKey: "countryLanguageId",
  as: "phrases",
});

db.models.CountryLanguagePhrase.belongsTo(db.models.CountryLanguage, {
  foreignKey: "countryLanguageId",
  as: "language",
});

export default db;
