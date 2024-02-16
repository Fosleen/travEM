export default (sequelize, DataTypes) => {
  const Place = sequelize.define(
    "place",
    {
      name: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      main_image_url: { type: DataTypes.STRING, allowNull: false },
      latitude: { type: DataTypes.DOUBLE, allowNull: false },
      longitude: { type: DataTypes.DOUBLE, allowNull: false },
      is_on_homepage_map: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: 0,
      },
      is_above_homepage_map: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: 0,
      },
      map_icon: { type: DataTypes.STRING },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Place;
};
