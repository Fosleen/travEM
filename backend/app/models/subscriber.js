export default (sequelize, DataTypes) => {
  const Subscriber = sequelize.define(
    "subscriber",
    {
      email: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Subscriber;
};
