export default (sequelize, DataTypes) => {
  const ArticleSpecialType = sequelize.define(
    "article_special_type",
    {
      name: { type: DataTypes.STRING(45), allowNull: true },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return ArticleSpecialType;
};
