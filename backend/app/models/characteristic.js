export default (sequelize, DataTypes) => {
  const Characteristic = sequelize.define(
    "characteristic",
    {
      title: { type: DataTypes.STRING(80), allowNull: false },
      description: { type: DataTypes.STRING(80), allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Characteristic;
};
