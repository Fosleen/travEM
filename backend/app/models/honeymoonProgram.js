export default (sequelize, DataTypes) =>
  sequelize.define(
    "honeymoon_program",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(160), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      destination: { type: DataTypes.STRING(160), allowNull: true },
      duration: { type: DataTypes.STRING(80), allowNull: true },
      price_from: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      display_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { underscored: true, freezeTableName: true }
  );
