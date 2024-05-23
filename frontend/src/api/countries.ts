import { CountriesData } from "../common/types";
import { apiUrl } from "./api";

export async function getCountries(page = 1, pageSize = 12) {
  const response = await fetch(
    `${apiUrl}/countries?page=${page}&pageSize=${pageSize}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getCountryById(id: number) {
  const response = await fetch(`${apiUrl}/countries/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getCountriesByName(
  name: string,
  page = 1,
  pageSize = 12,
  isCount?: number
) {
  if (isCount === undefined) {
    isCount = 0;
  }

  const response = await fetch(
    `${apiUrl}/countries/search/${name}?page=${page}&pageSize=${pageSize}&isCount=${isCount}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getCountriesByContinent(id: number) {
  const response = await fetch(`${apiUrl}/continents/countries/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function addCountry(
  name: string,
  description: string,
  main_image_url: string,
  flag_image_url: string,
  continent_id: number,
  color_id: number
) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/countries`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      name: name,
      description: description,
      main_image_url: main_image_url,
      flag_image_url: flag_image_url,
      continent_id: continent_id,
      color_id: color_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getCountryPlaces(id: number) {
  const response = await fetch(`${apiUrl}/countries/places/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updateCountry(country: CountriesData) {
  console.log(country);

  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/countries/${country.id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      name: country.name,
      description: country.description,
      main_image_url: country.main_image_url,
      flag_image_url: country.flag_image_url,
      continent_id: country.continentId,
      color_id: country.colorId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  console.log(data);

  return data;
}
