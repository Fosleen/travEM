export default (sequelize, DataTypes) => {
  const ArticleCommentLike = sequelize.define(
    "article_comment_like",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      visitor_hash: { type: DataTypes.STRING(128), allowNull: false },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ["article_comment_id", "visitor_hash"],
        },
      ],
    }
  );

  return ArticleCommentLike;
};
