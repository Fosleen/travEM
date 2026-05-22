export default (sequelize, DataTypes) => {
  const Section = sequelize.define(
    "section",
    {
      text: { type: DataTypes.TEXT, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false },
      subtitle: { type: DataTypes.STRING(100) },
      link_title: { type: DataTypes.STRING(100) },
      link_url: { type: DataTypes.STRING },
      show_visa_info: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      show_best_time_to_visit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Section;
};