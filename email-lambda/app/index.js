const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const cors = require("cors");
const express = require("express");
const { sendNewsletter } = require("./handler");

const app = express();

const corsOptions = {
  origin: "https://putujemstravem.com",
  credentials: true,
  methods: "POST",
  allowedHeaders: "Content-Type, Authorization",
};

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey || apiKey !== process.env.X_API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid API key" });
  }
  next();
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/", apiKeyMiddleware, sendNewsletter);

if (!process.env.ENV || process.env.ENV === "development") {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
