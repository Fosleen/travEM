export default (sequelize, DataTypes) => {
  const FooterItem = sequelize.define(
    "footer_item",
    {
      title: { type: DataTypes.STRING(45), allowNull: false },
      url: { type: DataTypes.STRING(45), allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return FooterItem;
};
