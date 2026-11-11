import { normalizeAirportCodes } from '../utils/airportCodes.js';
export default (sequelize, DataTypes) => {
  const AirportCity = sequelize.define(
    "airport_city",
    {
      name: { type: DataTypes.STRING(80), allowNull: true },
      iata_codes: {
        type: DataTypes.JSON,
        allowNull: true,
        set(value) { this.setDataValue('iata_codes', normalizeAirportCodes(value)); },
      },
      flag_url: { type: DataTypes.STRING(200), allowNull: true },
      is_in_croatia: { type: DataTypes.BOOLEAN(), allowNull: true },
      banner_image_url: { type: DataTypes.STRING, allowNull: true },
      is_active: {
        type: DataTypes.BOOLEAN(),
        allowNull: false,
        defaultValue: true,
      },
      display_order: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return AirportCity;
};
