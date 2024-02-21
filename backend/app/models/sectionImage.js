export default (sequelize, DataTypes) => {
  const SectionImage = sequelize.define(
    "section_image",
    {
      url: { type: DataTypes.STRING, allowNull: false },
      width: { type: DataTypes.INTEGER, allowNull: true },
      height: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return SectionImage;
};
