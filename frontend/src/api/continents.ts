import { apiUrl } from "./api";

export async function getContinents() {
  const response = await fetch(`${apiUrl}/continents`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getContinentById(id: number) {
  const response = await fetch(`${apiUrl}/continents/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
