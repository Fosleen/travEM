import { apiUrl } from "./api";

export async function getPlacesByCountry(id) {
  const response = await fetch(`${apiUrl}/countries/places/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
