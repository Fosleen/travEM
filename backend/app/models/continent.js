export default (sequelize, DataTypes) => {
  const Continent = sequelize.define(
    "continent",
    {
      name: { type: DataTypes.STRING(15), allowNull: false },
      latitude: { type: DataTypes.DOUBLE, allowNull: false },
      longitude: { type: DataTypes.DOUBLE, allowNull: false },
      zoom: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Continent;
};
