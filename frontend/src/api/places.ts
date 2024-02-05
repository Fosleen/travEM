import { apiUrl } from "./api";

export async function getPlaces(page = 1, pageSize = 12) {
  const response = await fetch(
    `${apiUrl}/places?page=${page}&pageSize=${pageSize}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getPlacesByCountry(id: number) {
  const response = await fetch(`${apiUrl}/countries/places/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getPlacesByName(name: string, page = 1, pageSize = 12) {
  const response = await fetch(
    `${apiUrl}/places/search/${name}?page=${page}&pageSize=${pageSize}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getPlacesById(id: number) {
  const response = await fetch(`${apiUrl}/places/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
