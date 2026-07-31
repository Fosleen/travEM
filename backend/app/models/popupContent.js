export default (sequelize, DataTypes) => {
  const PopupContent = sequelize.define(
    "popup_content",
    {
      image_url: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return PopupContent;
};
