export default (sequelize, DataTypes) => {
  const SpecificityImage = sequelize.define(
    "specificity_image",
    {
      url: { type: DataTypes.STRING, allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return SpecificityImage;
};
