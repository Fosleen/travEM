import { PlacesData } from "../common/types";

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

export async function getPlacesWithImage() {
  const response = await fetch(`${apiUrl}/places/with-image`);
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
  is_above_homepage_map: boolean,
  latitude: number,
  longitude: number,
  main_image_url: string,
  country_id: number,
  videos: Array<string>
) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/places`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      name: name,
      description: description,
      map_icon: map_icon,
      is_on_homepage_map: is_on_homepage_map,
      is_above_homepage_map: is_above_homepage_map,
      latitude: latitude,
      longitude: longitude,
      main_image_url: main_image_url,
      country_id: country_id,
      videos: videos,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function addPlaceOnMap(id: number) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/places/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      is_on_homepage_map: 1,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function removePlaceOnMap(id: number) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/places/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      is_on_homepage_map: 0,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function addPlaceAboveMap(id: number) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/places/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      is_above_homepage_map: 1,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function removePlaceAboveMap(id: number) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/places/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      is_above_homepage_map: 0,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function deletePlaceById(id: number) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/places/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  });
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updatePlace(place: PlacesData) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/places/${place.id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      description: place.description,
      name: place.name,
      main_image_url: place.main_image_url,
      map_icon: place.map_icon,
      is_on_homepage_map: place.is_on_homepage_map,
      is_above_homepage_map: place.is_above_homepage_map,
      latitude: place.latitude,
      longitude: place.longitude,
      country_id: place.country_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
