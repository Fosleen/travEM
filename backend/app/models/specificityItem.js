export default (sequelize, DataTypes) => {
  const SpecificityItem = sequelize.define(
    "specificity_item",
    {
      title: { type: DataTypes.STRING(30), allowNull: false },
      description: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return SpecificityItem;
};
