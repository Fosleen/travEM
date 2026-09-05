import { Sequelize } from "sequelize";
import sequelize from "../app/sequelize.js";

const COLUMN_NAME = "showcase_image_url";

try {
  const queryInterface = sequelize.getQueryInterface();
  const table = await queryInterface.describeTable("footer_partner");

  if (!table[COLUMN_NAME]) {
    await queryInterface.addColumn("footer_partner", COLUMN_NAME, {
      type: Sequelize.STRING(2048),
      allowNull: true,
      after: "image_url",
    });
    console.log(`Added footer_partner.${COLUMN_NAME}.`);
  } else {
    console.log(`footer_partner.${COLUMN_NAME} already exists.`);
  }
} catch (error) {
  console.error("Footer partner showcase migration failed:", error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
