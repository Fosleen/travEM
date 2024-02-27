export default (sequelize, DataTypes) => {
  const AirportCity = sequelize.define(
    "airport_city",
    {
      name: { type: DataTypes.STRING(80), allowNull: true },
      flag_url: { type: DataTypes.STRING(200), allowNull: true },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return AirportCity;
};
