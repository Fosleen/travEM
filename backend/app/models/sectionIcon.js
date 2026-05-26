export default (sequelize, DataTypes) => {
  const SectionIcon = sequelize.define(
    "section_icon",
    {
      url: { type: DataTypes.STRING, allowNull: false },
      feature_key: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return SectionIcon;
};