export default (sequelize, DataTypes) => {
  const Video = sequelize.define(
    "video",
    {
      url: { type: DataTypes.STRING, allowNull: false },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Video;
};
