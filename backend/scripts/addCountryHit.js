import { Sequelize } from "sequelize";
import sequelize from "../app/sequelize.js";

const COLUMN_NAME = "is_hit";

try {
  const queryInterface = sequelize.getQueryInterface();
  const table = await queryInterface.describeTable("country");

  if (!table[COLUMN_NAME]) {
    await queryInterface.addColumn("country", COLUMN_NAME, {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: "flag_image_url",
    });
    console.log(`Added country.${COLUMN_NAME}.`);
  } else {
    console.log(`country.${COLUMN_NAME} already exists.`);
  }
} catch (error) {
  console.error("Country hit migration failed:", error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
