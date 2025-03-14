export default (sequelize, DataTypes) => {
  const Subscriber = sequelize.define(
    "subscriber",
    {
      email: { type: DataTypes.STRING(200), allowNull: false, unique: true },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Subscriber;
};
