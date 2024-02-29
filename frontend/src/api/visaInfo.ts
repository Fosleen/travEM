import { token } from "../utils/global";
import { apiUrl } from "./api";

export async function checkIfInfoExists(
  countryId1: number,
  countryId2: number
) {
  const response = await fetch(
    `${apiUrl}/visa-info?country1=${countryId1}&country2=${countryId2}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function addVisaInfo(
  id_country_info: number,
  documentation: string,
  visa_needed: boolean,
  additional_info: string,
  country_id: number
) {
  const response = await fetch(`${apiUrl}/visa-info`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      id_country_info: id_country_info,
      documentation: documentation,
      visa_needed: visa_needed,
      additional_info: additional_info,
      country_id: country_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function patchVisaInfo(
  id: number,
  id_country_info: number,
  documentation: string,
  visa_needed: boolean,
  additional_info: string,
  country_id: number
) {
  const response = await fetch(`${apiUrl}/visa-info/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      id_country_info: id_country_info,
      documentation: documentation,
      visa_needed: visa_needed,
      additional_info: additional_info,
      country_id: country_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
