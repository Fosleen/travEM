export default (sequelize, DataTypes) => {
  const SectionImage = sequelize.define(
    "section_image",
    {
      url: { type: DataTypes.STRING(512), allowNull: false, validate: { len: [1, 512] } },
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
