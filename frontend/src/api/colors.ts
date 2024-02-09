import { apiUrl } from "./api";

export async function getColors() {
  const response = await fetch(`${apiUrl}/colors`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
