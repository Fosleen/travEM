import { apiUrl } from "./api";

export async function getCountryLanguage(
  countryId: number,
  includeInactive = false
) {
  const response = await fetch(
    `${apiUrl}/country-language/country/${countryId}${
      includeInactive ? "?includeInactive=true" : ""
    }`
  );

  const data = await response.json();

  if (!response.ok) {
    return null;
  }

  return data;
}

export async function addCountryLanguage(
  countryId: number,
  language_name: string,
  is_active: boolean,
  phrases: Array<{
    order_index: number;
    phrase: string;
    pronunciation: string;
  }>
) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/country-language`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      countryId,
      language_name,
      is_active,
      phrases,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }

  return data;
}

export async function patchCountryLanguage(
  id: number,
  language_name: string,
  is_active: boolean,
  phrases: Array<{
    order_index: number;
    phrase: string;
    pronunciation: string;
  }>
) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/country-language/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      language_name,
      is_active,
      phrases,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }

  return data;
}