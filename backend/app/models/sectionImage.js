export default (sequelize, DataTypes) => {
  const SectionImage = sequelize.define(
    "section_image",
    {
      url: { type: DataTypes.STRING, allowNull: false },
      orientation: { type: DataTypes.STRING, allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return SectionImage;
};
