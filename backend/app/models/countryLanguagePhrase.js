export default (sequelize, DataTypes) => {
  const CountryLanguagePhrase = sequelize.define(
    "country_language_phrase",
    {
      countryLanguageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "countryLanguageId",
      },
      order_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phrase: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      pronunciation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      underscored: false,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return CountryLanguagePhrase;
};