import { Sequelize } from "sequelize";
import express from "express";
import cors from "cors";
import logger from "morgan";
import dbConfig from "./app/config/db-config.js";
import router from "./app/routes/index.js";
import passport from "passport";
import session from "express-session";
import { authenticateJwt } from "./app/middleware/auth.js";
import { exec } from "child_process";
import { createAssociations } from "./database_management.js";

const app = express();

// Create all 1:1, 1:M and M:N
createAssociations();

const corsOptions = {
  origin: "https://putujemstravem.com", //change this to localhost:5173 for testing
  credentials: true,
  methods: "GET, POST, PATCH, DELETE, PUT",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
//app.use(helmet());
app.set("view engine", "ejs");
app.use(cors(corsOptions));
app.use(
  session({
    secret: "1234",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", router);
app.use("/api/v1/secure", authenticateJwt, router); //middleware checking for jwt validity

app.post("/deploy", (req, res) => {
  const { body } = req;
  console.log("GitHub Webhook Payload:", body);

  console.log("Current working directory:", process.cwd());
  exec("php deploy.php", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing deploy.php: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error executing deploy.php: ${stderr}`);
      return;
    }
    console.log(`deploy.php output: ${stdout}`);
  });
});

// Start the server
const PORT = dbConfig.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
