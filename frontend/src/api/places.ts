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

export async function addPlace(
  name: string,
  description: string,
  map_icon: string,
  is_on_homepage_map: boolean,
  latitude: number,
  longitude: number,
  main_image_url: string,
  country_id: number,
  videos: Array<string>
) {
  const response = await fetch(`${apiUrl}/places`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      name: name,
      description: description,
      map_icon: map_icon,
      is_on_homepage_map: is_on_homepage_map,
      latitude: latitude,
      longitude: longitude,
      main_image_url: main_image_url,
      country_id: country_id,
      videos: videos,
    }),
  });


export async function getPlacesById(id: number) {
  const response = await fetch(`${apiUrl}/places/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
