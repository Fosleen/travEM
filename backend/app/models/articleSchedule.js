export default (sequelize, DataTypes) => {
  const ArticleSchedule = sequelize.define(
    "article_schedule",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      publish_at: { type: DataTypes.DATE, allowNull: true },
      publish_timezone: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "Europe/Zagreb",
      },
      notify_subscribers_on_publish: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      newsletter_sent_at: { type: DataTypes.DATE, allowNull: true },
      newsletter_send_started_at: { type: DataTypes.DATE, allowNull: true },
      newsletter_send_error: { type: DataTypes.TEXT, allowNull: true },
      publish_processed_at: { type: DataTypes.DATE, allowNull: true },
      publish_process_error: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return ArticleSchedule;
};
