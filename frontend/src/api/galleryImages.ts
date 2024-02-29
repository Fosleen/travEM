import { token } from "../utils/global";
import { apiUrl } from "./api";

export async function addGalleryImage(
  url: string,
  height: string,
  width: string,
  article_id: number
) {
  const response = await fetch(`${apiUrl}/gallery-images`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      url: url,
      height: height,
      width: width,
      article_id: article_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function deleteGalleryImage(id: number) {
  const response = await fetch(`${apiUrl}/gallery-images/${id}`, {
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
