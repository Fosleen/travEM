export default (sequelize, DataTypes) => {
  return sequelize.define(
    "article_affiliate_link",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      // NULL means this article inherits affiliate_partner.default_url.
      url: { type: DataTypes.STRING(2048), allowNull: true },
      icon_url: { type: DataTypes.STRING(255), allowNull: true },
      is_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ["article_id", "affiliate_partner_id"],
        },
      ],
    }
  );
};
