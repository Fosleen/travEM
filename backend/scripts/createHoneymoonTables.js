import db from "../app/models/index.js";
import { createAssociations } from "../database_management.js";

try {
  createAssociations();
  await db.models.HoneymoonProgram.sync();
  await db.models.HoneymoonProgramImage.sync();
  await db.models.HoneymoonInquiry.sync();
  await db.models.HoneymoonSetting.sync();
  console.log("Honeymoon tables are ready.");
  await db.sequelize.close();
} catch (error) {
  console.error("Honeymoon migration failed:", error);
  process.exitCode = 1;
}
