export default (sequelize, DataTypes) => {
  const CountryLanguage = sequelize.define(
    "country_language",
    {
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "countryId",
      },
      language_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      underscored: false,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return CountryLanguage;
};