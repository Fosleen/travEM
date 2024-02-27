export default (sequelize, DataTypes) => {
  const CharacteristicIcon = sequelize.define(
    "characteristic_icon",
    {
      url: { type: DataTypes.STRING(200), allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return CharacteristicIcon;
};
