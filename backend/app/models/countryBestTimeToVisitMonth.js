export default (sequelize, DataTypes) => {
  const CountryBestTimeToVisitMonth = sequelize.define(
    "country_best_time_to_visit_month",
    {
      country_best_time_to_visit_region_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month_key: {
        type: DataTypes.ENUM(
          "jan",
          "feb",
          "mar",
          "apr",
          "may",
          "jun",
          "jul",
          "aug",
          "sep",
          "oct",
          "nov",
          "dec"
        ),
        allowNull: false,
      },
      avg_temp_c: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      avg_rain_mm: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
      },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return CountryBestTimeToVisitMonth;
};