export default (sequelize, DataTypes) => {
  const AirplaneTicketPromo = sequelize.define(
    "airplane_ticket_promo",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      top_text: { type: DataTypes.STRING(120), allowNull: false },
      middle_text: { type: DataTypes.STRING(255), allowNull: false },
      button_text: { type: DataTypes.STRING(45), allowNull: false },
      article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
    }
  );

  return AirplaneTicketPromo;
};
