export default (sequelize, DataTypes) => {
  const Footer = sequelize.define(
    "footer",
    {
      image_url: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Footer;
};
