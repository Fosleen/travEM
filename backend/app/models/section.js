export default (sequelize, DataTypes) => {
  const Section = sequelize.define(
    "section",
    {
      text: { type: DataTypes.TEXT, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false },
      subtitle: { type: DataTypes.STRING(100), allowNull: false },
      link_title: { type: DataTypes.STRING(100), allowNull: false },
      link_url: { type: DataTypes.STRING, allowNull: false },
      icon_url: { type: DataTypes.STRING, allowNull: false },
    },
    {
      underscored: true, // vanjski kljuc ce bit snake_case, a ne camelCase
      timestamps: false,
      freezeTableName: true, // da ne pluralizira tablicu
    }
  );

  return Section;
};
