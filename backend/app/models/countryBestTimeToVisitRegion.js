export default (sequelize, DataTypes) => {
  const CountryBestTimeToVisitRegion = sequelize.define(
    "country_best_time_to_visit_region",
    {
      country_best_time_to_visit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      region_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return CountryBestTimeToVisitRegion;
};