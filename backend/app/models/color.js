export default (sequelize, DataTypes) => {
  const Color = sequelize.define(
    "color",
    {
      hex_value: { type: DataTypes.STRING(8), allowNull: false },
      name: { type: DataTypes.STRING(45), allowNull: false },
      url: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Color;
};
