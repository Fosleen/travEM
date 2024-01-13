import db from "../models/index.js";

export async function getHomepage() {
  try {
    const homepages = await db.models.Homepage.findOne();
    return homepages;
  } catch (error) {
    return [];
  }
}
