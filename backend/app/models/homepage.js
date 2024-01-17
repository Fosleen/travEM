export default (sequelize, DataTypes) => {
  const Homepage = sequelize.define(
    "homepage",
    {
      hero_image_url: { type: DataTypes.STRING(225), allowNull: false },
      banner_image_url: { type: DataTypes.STRING(255), allowNull: false },
      banner_title: { type: DataTypes.STRING(45), allowNull: false },
      banner_small_text: { type: DataTypes.STRING(45), allowNull: false },
      banner_description: { type: DataTypes.STRING(200), allowNull: false },
      button_text: { type: DataTypes.STRING(45), allowNull: false },
      flights_nmbr: { type: DataTypes.STRING(4), allowNull: false },
      videos_nmbr: { type: DataTypes.STRING(4), allowNull: false },
      distance_nmbr: { type: DataTypes.STRING(4), allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Homepage;
};
