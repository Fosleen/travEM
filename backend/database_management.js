import db from "./app/models/index.js";

export const createAssociations = () => {
  // 1:1
  db.models.Article.hasOne(db.models.Video);
  db.models.Video.belongsTo(db.models.Article);

  db.models.SectionIcon.hasOne(db.models.Section);
  db.models.Section.belongsTo(db.models.SectionIcon);

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

  db.models.Section.hasMany(db.models.SectionImage, {
    foreignKey: { allowNull: false },
  });
  db.models.SectionImage.belongsTo(db.models.Section);

  db.models.Country.belongsTo(db.models.Color, {
    foreignKey: { allowNull: false },
  });

  db.models.Country.belongsTo(db.models.Continent, {
    foreignKey: { allowNull: false },
  });

  db.models.Country.hasMany(db.models.VisaInfo, {
    foreignKey: { allowNull: false },
  });

  db.models.Country.hasMany(db.models.Characteristic, {
    foreignKey: { allowNull: false },
  });

  db.models.CharacteristicIcon.hasMany(db.models.Characteristic, {
    foreignKey: { allowNull: false },
  });
  db.models.Characteristic.belongsTo(db.models.CharacteristicIcon, {
    foreignKey: { allowNull: false },
  });

  // M:N - super many to many - da se iz many-many tablice mogu pozivat tablice od kojih se sastoji (inace se moze samo obrnuto)
  db.models.ArticleSpecialType.belongsToMany(db.models.Article, {
    through: db.models.Article_ArticleSpecialType,
  });
  db.models.Article.belongsToMany(db.models.ArticleSpecialType, {
    through: db.models.Article_ArticleSpecialType,
  });
  db.models.ArticleSpecialType.hasMany(db.models.Article_ArticleSpecialType);
  db.models.Article_ArticleSpecialType.belongsTo(db.models.ArticleSpecialType);
  db.models.Article.hasMany(db.models.Article_ArticleSpecialType);
  db.models.Article_ArticleSpecialType.belongsTo(db.models.Article);
};

/*
// Create tables from models folder
db.sequelize
  .sync()
  .then(() => {
    console.log("Table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });
*/
