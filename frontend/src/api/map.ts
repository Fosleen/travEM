import { apiUrl } from "./api";

export async function getVisitedCountries() {
  const response = await fetch(`${apiUrl}/map`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
