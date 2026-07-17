import { CountriesData } from "../common/types";
import { apiUrl } from "./api";

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
  try {
    const response = await fetch(
      `${apiUrl}/countries?page=${page}&pageSize=${pageSize}&noCache=${noCache}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching countries:", error);
    return { error: error.message };
  }
}

export async function getCountryById(id: number, noCache: boolean = false) {
  try {
    const response = await fetch(
      `${apiUrl}/countries/${id}?noCache=${noCache}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching country:", error);
    return { error: error.message };
  }
}

export async function getCountriesByName(
  name: string,
  page = 1,
  pageSize = 12,
  isCount?: number,
  noCache: boolean = false
) {
  try {
    if (isCount === undefined) {
      isCount = 0;
    }

    const encodedName = encodeURIComponent(name);

    const response = await fetch(
      `${apiUrl}/countries/search/${encodedName}?page=${page}&pageSize=${pageSize}&isCount=${isCount}&noCache=${noCache}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching countries by name:", error);
    return { error: error.message };
  }
}

export async function getCountriesByContinent(
  id: number,
  noCache: boolean = false
) {
  try {
    const response = await fetch(
      `${apiUrl}/continents/countries/${id}?noCache=${noCache}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching countries by continent:", error);
    return { error: error.message };
  }
}

export async function addCountry(
  name: string,
  description: string,
  main_image_url: string,
  flag_image_url: string,
  continent_id: number,
  color_id: number,
  best_time_to_visit?: any
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
      name,
      description,
      main_image_url,
      flag_image_url,
      continent_id,
      color_id,
      best_time_to_visit,
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
  try {
    const response = await fetch(
      `${apiUrl}/countries/places/${id}?noCache=${noCache}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return [];
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching country places:", error);
    return [];
  }
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
      best_time_to_visit: country.best_time_to_visit,
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