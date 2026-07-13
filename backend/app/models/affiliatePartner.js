export default (sequelize, DataTypes) => {
  return sequelize.define(
    "affiliate_partner",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      label: { type: DataTypes.STRING(140), allowNull: false },
      default_url: { type: DataTypes.STRING(2048), allowNull: false },
      icon_url: { type: DataTypes.STRING(255), allowNull: false },
      sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );
};
