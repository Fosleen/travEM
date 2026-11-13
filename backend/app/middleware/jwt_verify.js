import jwt from "jsonwebtoken";
import db from "../models/index.js";

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Bearer token missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Failed to authenticate token" });
    }
    try {
      const user = await db.models.User.findByPk(decoded.id);
      if (!user) return res.status(401).json({ error: "Korisnik nije pronađen." });
      req.user = user;
      next();
    } catch (error) { next(error); }
  });
}
