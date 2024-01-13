import { Sequelize } from "sequelize";
import express from "express";
import cors from "cors";
import logger from "morgan";
import dbConfig from "./app/config/db-config.js";
import db from "./app/models/index.js";
import router from "./app/routes/index.js";

const app = express();

const sequelize = new Sequelize(
  `${dbConfig.DIALECT}://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DATABASE}`
);

const createAssociations = () => {
  // 1:1
  db.models.Article.hasOne(db.models.Video);
  db.models.Video.belongsTo(db.models.Article);

  // 1:M
  db.models.ArticleType.hasMany(db.models.Article, {
    foreignKey: { allowNull: false },
  }); // article_type_id u Article ne smije biti null
  db.models.Article.belongsTo(db.models.ArticleType);

  db.models.Country.hasMany(db.models.Article);
  db.models.Article.belongsTo(db.models.Country);

  db.models.Place.hasMany(db.models.Article);
  db.models.Article.belongsTo(db.models.Place);

  db.models.Place.hasMany(db.models.Video);
  db.models.Video.belongsTo(db.models.Place);

  db.models.Country.hasMany(db.models.Video);
  db.models.Video.belongsTo(db.models.Country);

  db.models.User.hasMany(db.models.Article, {
    foreignKey: { allowNull: false },
  });
  db.models.Article.belongsTo(db.models.User);

  db.models.Country.hasMany(db.models.Specificity, {
    foreignKey: { allowNull: false },
  });
  db.models.Specificity.belongsTo(db.models.Country);

  db.models.Country.hasMany(db.models.Place, {
    foreignKey: { allowNull: false },
  });
  db.models.Place.belongsTo(db.models.Country);

  db.models.Specificity.hasMany(db.models.SpecificityItem, {
    foreignKey: { allowNull: false },
  });
  db.models.SpecificityItem.belongsTo(db.models.Specificity);

  db.models.Specificity.hasMany(db.models.SpecificityImage, {
    foreignKey: { allowNull: false },
  });
  db.models.SpecificityImage.belongsTo(db.models.Specificity);

  db.models.Article.hasMany(db.models.GalleryImage, {
    foreignKey: { allowNull: false },
  });
  db.models.GalleryImage.belongsTo(db.models.Article);

  db.models.Article.hasMany(db.models.Section, {
    foreignKey: { allowNull: false },
  });
  db.models.Section.belongsTo(db.models.Article);

  db.models.Footer.hasMany(db.models.FooterGroup, {
    foreignKey: { allowNull: false },
  });

  db.models.FooterGroup.hasMany(db.models.FooterItem, {
    foreignKey: { allowNull: false },
  });

  db.models.Country.belongsTo(db.models.Color, {
    foreignKey: { allowNull: false },
  });

  db.models.Country.belongsTo(db.models.Continent, {
    foreignKey: { allowNull: false },
  });

  db.models.Country.hasMany(db.models.Characteristic, {
    foreignKey: { allowNull: false },
  });

  db.models.CharacteristicIcon.hasMany(db.models.Characteristic, {
    foreignKey: { allowNull: false },
  });

  // M:N
  db.models.Section.belongsToMany(db.models.SectionImage, {
    through: "section_image_has_section",
  });
  db.models.SectionImage.belongsToMany(db.models.Section, {
    through: "section_image_has_section",
  });

  db.models.ArticleSpecialType.belongsToMany(db.models.Article, {
    through: "article_has_article_special_type",
  });

  db.models.Article.belongsToMany(db.models.ArticleSpecialType, {
    through: "article_has_article_special_type",
  });
};

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

// Create all 1:1, 1:M and M:N
createAssociations();

// Create tables from models folder
db.sequelize
  .sync()
  .then(() => {
    console.log("Table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use("/api", router);

// Start the server
const PORT = dbConfig.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
