export default (sequelize, DataTypes) => {
  const ArticleType = sequelize.define(
    "article_type",
    {
      name: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      freezeTableName: true, // da ne pluralizira tablicu
    }
  );

  return ArticleType;
};
