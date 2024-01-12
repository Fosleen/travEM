export default (sequelize, DataTypes) => {
  const Country = sequelize.define(
    "country",
    {
      name: { type: DataTypes.STRING(60), allowNull: false },
      description: { type: DataTypes.STRING(100), allowNull: false },
      main_image_url: { type: DataTypes.STRING, allowNull: false },
      flag_image_url: { type: DataTypes.STRING, allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Country;
};
