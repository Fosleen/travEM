export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      first_name: { type: DataTypes.STRING(100), allowNull: false },
      last_name: { type: DataTypes.STRING(100), allowNull: false },
      is_admin: { type: DataTypes.TINYINT(1), default: 0 },
    },
    {
      freezeTableName: true, // da ne pluralizira tablicu
    }
  );

  return User;
};
