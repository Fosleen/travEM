import { apiUrl } from "./api";

export async function getSectionIcons() {
  const response = await fetch(`${apiUrl}/section-icons`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
