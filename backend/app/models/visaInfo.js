export default (sequelize, DataTypes) => {
  const VisaInfo = sequelize.define(
    "visa_info",
    {
      documentation: { type: DataTypes.STRING, allowNull: false },
      additional_info: { type: DataTypes.STRING, allowNull: false },
      visa_needed: { type: DataTypes.BOOLEAN, allowNull: false },
      id_country_info: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return VisaInfo;
};
