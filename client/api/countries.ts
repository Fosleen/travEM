import { CountriesData } from "../common/types";
import { apiUrl } from "./api";

// Helper function to get token (only on client side)
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt");
  }
  return null;
};

export async function getCountries(
  page = 1,
  pageSize = 12,
  noCache: boolean = false
) {
  const response = await fetch(
    `${apiUrl}/countries?page=${page}&pageSize=${pageSize}&noCache=${noCache}`,
    {
      next: { revalidate: noCache ? 0 : 3600 },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getCountryById(id: number, noCache: boolean = false) {
  const response = await fetch(`${apiUrl}/countries/${id}?noCache=${noCache}`, {
    next: { revalidate: noCache ? 0 : 3600 },
  });
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
  isCount?: number,
  noCache: boolean = false
) {
  if (isCount === undefined) {
    isCount = 0;
  }
  const response = await fetch(
    `${apiUrl}/countries/search/${name}?page=${page}&pageSize=${pageSize}&isCount=${isCount}&noCache=${noCache}`,
    {
      next: { revalidate: noCache ? 0 : 3600 },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getCountriesByContinent(
  id: number,
  noCache: boolean = false
) {
  const response = await fetch(
    `${apiUrl}/continents/countries/${id}?noCache=${noCache}`,
    {
      next: { revalidate: noCache ? 0 : 3600 },
    }
  );
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
  const token = getToken();
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

export async function getCountryPlaces(id: number, noCache: boolean = false) {
  const response = await fetch(
    `${apiUrl}/countries/places/${id}?noCache=${noCache}`,
    {
      next: { revalidate: noCache ? 0 : 3600 },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    console.log(data.error);
    return [];
  }
  return data;
}

export async function updateCountry(country: CountriesData) {
  console.log(country);
  const token = getToken();
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
