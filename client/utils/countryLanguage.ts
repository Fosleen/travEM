import { apiUrl } from "./api";

export async function getCountryLanguage(countryId: number) {
  const response = await fetch(`${apiUrl}/country-language/country/${countryId}`);

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return null;
  }

  return data;
}