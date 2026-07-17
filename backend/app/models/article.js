export default (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "article",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: { type: DataTypes.STRING(100), allowNull: false },
      subtitle: { type: DataTypes.STRING(100) },
      description: { type: DataTypes.STRING(100) },
      main_image_url: { type: DataTypes.STRING },
      metatags: { type: DataTypes.STRING },
      date_written: { type: DataTypes.DATEONLY, allowNull: false },
      date_updated: { type: DataTypes.DATEONLY, allowNull: true },
      isFarDestination: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isTipsFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Article;
};