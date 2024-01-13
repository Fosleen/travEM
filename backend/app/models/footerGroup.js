export default (sequelize, DataTypes) => {
  const FooterGroup = sequelize.define(
    "footer_group",
    {
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return FooterGroup;
};
