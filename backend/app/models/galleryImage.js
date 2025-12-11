export default (sequelize, DataTypes) => {
  const GalleryImage = sequelize.define(
    // ako se ne doda id atribut, on ce se automatski dodat kao PK
    "gallery_image",
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

  return GalleryImage;
};
