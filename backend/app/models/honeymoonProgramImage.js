export default (sequelize, DataTypes) =>
  sequelize.define(
    "honeymoon_program_image",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      image_url: { type: DataTypes.TEXT, allowNull: false },
      display_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { underscored: true, freezeTableName: true }
  );
