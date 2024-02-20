export default (sequelize, DataTypes) => {
  const SectionImage = sequelize.define(
    "section_image",
    {
      url: { type: DataTypes.STRING, allowNull: false },
      width: { type: DataTypes.INTEGER, allowNull: false },
      height: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return SectionImage;
};
