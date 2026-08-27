export default (sequelize, DataTypes) => {
  return sequelize.define(
    "footer_partner",
    {
      name: { type: DataTypes.STRING(100), allowNull: false },
      image_url: { type: DataTypes.STRING(2048), allowNull: false },
      showcase_image_url: { type: DataTypes.STRING(2048), allowNull: true },
      target_url: { type: DataTypes.STRING(2048), allowNull: false },
      sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { underscored: true, timestamps: false, freezeTableName: true }
  );
};
