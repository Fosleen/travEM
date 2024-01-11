import dbConfig from "../config/db-config.js";
import { Sequelize } from "sequelize";
import User from "./user.js";
import articleType from "./articleType.js";

const sequelize = new Sequelize(
  `${dbConfig.DIALECT}://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DATABASE}`
);

const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.User = User(sequelize, Sequelize.DataTypes);
db.models.ArticleType = articleType(sequelize, Sequelize.DataTypes);

export default db;
