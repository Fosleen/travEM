import db from "../models/index.js";
import { createUserAccount, publicUser, publicUserAttributes } from "../services/userService.js";

export async function listUsers(req, res, next) {
  try {
    const users = await db.models.User.findAll({ attributes: publicUserAttributes, order: [["id", "ASC"]] });
    res.set("Cache-Control", "private, no-store");
    res.json(users);
  } catch (error) { next(error); }
}

export async function addUser(req, res, next) {
  try {
    const user = await createUserAccount(req.body);
    res.set("Cache-Control", "private, no-store");
    res.status(201).json({ success: true, user: publicUser(user) });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    next(error);
  }
}
