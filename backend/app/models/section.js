export default (sequelize, DataTypes) => {
  const Section = sequelize.define(
    "section",
    {
      text: { type: DataTypes.TEXT, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false },
      subtitle: { type: DataTypes.STRING(100) },
      link_title: { type: DataTypes.STRING(100) },
      link_url: { type: DataTypes.STRING },
      icon_url: { type: DataTypes.STRING }, // ako nema ikonu ili podnaslov, ne prikazuje se u sadrzaju (jer mozda iz nekog razloga ne zele da se prikaze tamo)
    },
    {
      underscored: true, // vanjski kljuc ce bit snake_case, a ne camelCase
      timestamps: false,
      freezeTableName: true, // da ne pluralizira tablicu
    }
  );

  return Section;
};
