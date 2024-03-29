import dotenv from "dotenv";

dotenv.config();

const config = {
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASSWORD: process.env.PASS,
  DATABASE: process.env.DATABASE,
  DIALECT: process.env.DIALECT,
  PORT: process.env.PORT,
};

export default config;
