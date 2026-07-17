export default (sequelize, DataTypes) => {
  const ArticleComment = sequelize.define(
    "article_comment",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      username: { type: DataTypes.STRING(80), allowNull: false },
      email: { type: DataTypes.STRING(200), allowNull: true },
      body: { type: DataTypes.TEXT, allowNull: false },
      status: {
        type: DataTypes.ENUM("published", "pending", "rejected"),
        allowNull: false,
        defaultValue: "published",
      },
      moderation_reason: { type: DataTypes.STRING(255), allowNull: true },
      notify_on_reply: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      unsubscribe_token: { type: DataTypes.STRING(120), allowNull: true },
      is_admin_reply: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      like_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return ArticleComment;
};
