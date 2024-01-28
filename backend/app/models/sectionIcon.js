export default (sequelize, DataTypes) => {
  const SectionIcon = sequelize.define(
    "section_icon",
    {
      url: { type: DataTypes.STRING, allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return SectionIcon;
};
