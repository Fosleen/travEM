export default (sequelize, DataTypes) => {
  const Continent = sequelize.define(
    "continent",
    {
      name: { type: DataTypes.STRING(15), allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Continent;
};
