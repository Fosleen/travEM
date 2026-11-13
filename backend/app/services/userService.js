import bcrypt from "bcrypt";
import db from "../models/index.js";

export const publicUserAttributes = ["id", "username", "first_name", "last_name", "is_admin"];
export const publicUser = (user) => Object.fromEntries(publicUserAttributes.map((key) => [key, user[key]]));

const invalid = (message, status = 400) => Object.assign(new Error(message), { status });

export async function createUserAccount(body, { allowAdmin = false } = {}) {
  const fields = {};
  for (const [key, label, max] of [["username", "Korisničko ime", 255], ["first_name", "Ime", 100], ["last_name", "Prezime", 100]]) {
    if (typeof body[key] !== "string" || !body[key].trim() || body[key].trim().length > max) {
      throw invalid(`${label} je obavezno i smije imati najviše ${max} znakova.`);
    }
    fields[key] = body[key].trim();
  }
  if (typeof body.password !== "string" || body.password.length < 8) throw invalid("Lozinka mora imati najmanje 8 znakova.");
  if (Buffer.byteLength(body.password, "utf8") > 72) throw invalid("Lozinka je predugačka. Unesite kraću lozinku.");
  const role = allowAdmin ? Number(body.is_admin ?? 0) : 0;
  if (![0, 1].includes(role)) throw invalid("Nepoznata korisnička uloga.");
  if (await db.models.User.findOne({ where: { username: fields.username } })) throw invalid("Korisničko ime već postoji.", 409);
  try {
    return await db.models.User.create({ ...fields, password: await bcrypt.hash(body.password, 10), is_admin: role });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") throw invalid("Korisničko ime već postoji.", 409);
    throw error;
  }
}
