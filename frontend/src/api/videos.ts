import { token } from "../utils/global";
import { apiUrl } from "./api";

export async function addVideo(
  url: string,
  article_id?: number | null,
  place_id?: number | null,
  country_id?: number | null
) {
  const response = await fetch(`${apiUrl}/videos`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      url: url,
      article_id: article_id,
      place_id: place_id,
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

export async function updateVideo(id: number, url: string) {
  const response = await fetch(`${apiUrl}/videos/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      url: url,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function deleteVideo(id: number) {
  const response = await fetch(`${apiUrl}/videos/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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
