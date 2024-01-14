import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import db from "../models/index.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "1234", // Replace with your secret key for JWT
};

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

export const generateJwtToken = (user) => {
  return jwt.sign({ id: user.id }, "1234"); // Replace with your secret key for JWT
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await db.models.User.findOne({ where: { username } });

    if (!user || password !== user.password) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed." });
    }

    // Generate a new JWT token for the authenticated user
    const token = generateJwtToken(user);

    return res.json({
      success: true,
      message: "Authentication succeeded.",
      token,
    });
  } catch (error) {
    return next(error);
  }
};
