import { apiUrl } from "./api";

export async function getAirportCities() {
  const response = await fetch(`${apiUrl}/airport-cities`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
