export default (sequelize, DataTypes) => {
  const GalleryImage = sequelize.define(
    // ako se ne doda id atribut, on ce se automatski dodat kao PK
    "gallery_image",
    {
      url: { type: DataTypes.STRING, allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return GalleryImage;
};
