import { getHomepage } from "../services/homepageService.js";

export async function getAll(req, res) {
  const response = await getHomepage();
  if (response == undefined) {
    res.status(404).json({ error: "Couldn't find homepage" });
  } else {
    res.json(response);
  }
}
