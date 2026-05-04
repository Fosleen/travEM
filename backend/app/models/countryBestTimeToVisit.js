export default (sequelize, DataTypes) => {
  const CountryBestTimeToVisit = sequelize.define(
    "country_best_time_to_visit",
    {
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      subtitle: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      is_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return CountryBestTimeToVisit;
};