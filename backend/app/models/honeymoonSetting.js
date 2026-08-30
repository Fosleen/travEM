export default (sequelize, DataTypes) =>
  sequelize.define(
    "honeymoon_setting",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
      hero_image_url: { type: DataTypes.TEXT, allowNull: true },
    },
    { underscored: true, freezeTableName: true }
  );
