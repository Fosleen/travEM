export default (sequelize, DataTypes) => {
  const Homepage = sequelize.define(
    "homepage",
    {
      hero_image_url: { type: DataTypes.STRING(225), allowNull: false },
      banner_title: { type: DataTypes.STRING(45), allowNull: false },
      banner_small_text: { type: DataTypes.STRING(45), allowNull: false },
      banner_description: { type: DataTypes.STRING(45), allowNull: false },
      button_text: { type: DataTypes.STRING(45), allowNull: false },
      flights_nmbr: { type: DataTypes.INTEGER, allowNull: false },
      videos_nmbr: { type: DataTypes.INTEGER, allowNull: false },
      distance_nmbr: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Homepage;
};
