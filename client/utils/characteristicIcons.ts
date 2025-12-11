import { apiUrl } from "./api";

export async function getCharacteristicIcons() {
  const response = await fetch(`${apiUrl}/characteristic-icons`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
