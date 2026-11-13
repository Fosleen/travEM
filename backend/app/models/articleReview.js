export default (sequelize, DataTypes) => sequelize.define("article_review", {
  article_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "pending" },
  submitted_at: { type: DataTypes.DATE, allowNull: true },
  reviewed_at: { type: DataTypes.DATE, allowNull: true },
  reviewed_by: { type: DataTypes.INTEGER, allowNull: true },
  note: { type: DataTypes.TEXT, allowNull: true },
}, { freezeTableName: true, timestamps: false });
