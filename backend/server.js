const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();

// Sequelize setup
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./app/config/database.sqlite", // Specify your database file path
});

// Define User model
const User = sequelize.define("User", {
  username: DataTypes.STRING,
});

// Create table if not exists
sequelize.sync();

// Express route to create a user
app.post("/create-user", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.create({ username });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Express route to get all users
app.get("/get-users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
