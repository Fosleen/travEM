import { apiUrl } from "./api";

export async function getVisitedCountries() {
  const response = await fetch(`${apiUrl}/countries`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getVisitedPlaces() {
  const response = await fetch(`${apiUrl}/places/favorite`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
