import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import db from "../models/index.js";
import bcrypt from "bcrypt";
import ms from "ms";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

const secretKey = process.env.JWT_SECRET_KEY;

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await db.models.User.findByPk(jwtPayload.id);

      if (!user) {
        return done(null, false, { message: "User not found." });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});

export const authenticateJwt = passport.authenticate("jwt", { session: false });

const generateJwtToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: 43200 });
  const expirationTime = Math.floor(Date.now() / 1000) + ms(43200) / 1000;
  console.log("Expiration time:", expirationTime);
  return { token, expirationTime };
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await db.models.User.findOne({ where: { username } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed." });
    }

    // Generate a new JWT token for the authenticated user
    const { token, expirationTime } = generateJwtToken(user);

    console.log("Expiration time jest:", expirationTime);

    return res.json({
      success: true,
      message: "Authentication succeeded.",
      token,
      expirationTime,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (error) {
    return next(error);
  }
};

//REGISTRATION

export const register = async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, is_admin } = req.body;

    // Check if the username is already taken
    const existingUser = await db.models.User.findOne({ where: { username } });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Create a new user with the hashed password
    const newUser = await db.models.User.create({
      username,
      password: hashedPassword,
      first_name,
      last_name,
      is_admin,
    });

    // Generate a new JWT token for the registered user
    const { token, expirationTime } = generateJwtToken(newUser);
    console.log("Expiration Time:", expirationTime); // Add this line

    return res.json({
      success: true,
      message: "Registration succeeded.",
      token,
      expirationTime,
    });
  } catch (error) {
    return next(error);
  }
};
