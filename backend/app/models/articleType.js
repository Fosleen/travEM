export default (sequelize, DataTypes) => {
  const ArticleType = sequelize.define(
    "article_type",
    {
      name: { type: DataTypes.STRING(100), allowNull: false },
    },
    { underscored: true, timestamps: false, freezeTableName: true }
  );

  return ArticleType;
};
