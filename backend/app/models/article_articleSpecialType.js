export default (sequelize, DataTypes) => {
  const Article_ArticleSpecialType = sequelize.define(
    // mora se definirat vise vise model ako zelimo dodavati dodatne stupce i valjda radit inserti nad njome i ak ne zelimo imat timestampse
    "article_has_article_special_type",
    {},
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Article_ArticleSpecialType;
};
