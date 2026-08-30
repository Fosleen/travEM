export default (sequelize, DataTypes) =>
  sequelize.define(
    "honeymoon_inquiry",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      first_name: { type: DataTypes.STRING(80), allowNull: false },
      last_name: { type: DataTypes.STRING(80), allowNull: false },
      email: { type: DataTypes.STRING(200), allowNull: false },
      phone: { type: DataTypes.STRING(50), allowNull: true },
      approximate_date: { type: DataTypes.DATEONLY, allowNull: true },
      traveler_count: { type: DataTypes.INTEGER, allowNull: false },
      estimated_budget: { type: DataTypes.STRING(100), allowNull: true },
      preferred_destinations: { type: DataTypes.STRING(500), allowNull: true },
      departure_airport: { type: DataTypes.STRING(160), allowNull: true },
      message: { type: DataTypes.TEXT, allowNull: true },
      program_name: { type: DataTypes.STRING(160), allowNull: false },
      is_open_inquiry: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      privacy_accepted_at: { type: DataTypes.DATE, allowNull: false },
    },
    { underscored: true, updatedAt: false, freezeTableName: true }
  );
