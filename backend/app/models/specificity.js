export default (sequelize, DataTypes) => {
  const Specificity = sequelize.define(
    "specificity",
    {
      title: { type: DataTypes.STRING(45), allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Specificity;
};
