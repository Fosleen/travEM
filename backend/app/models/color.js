export default (sequelize, DataTypes) => {
  const Color = sequelize.define(
    "color",
    {
      hex_value: { type: DataTypes.STRING(8), allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Color;
};
