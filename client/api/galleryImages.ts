import { apiUrl } from "./api";

export async function addGalleryImage(
  url: string,
  article_id: number,
  height?: string,
  width?: string
) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/gallery-images`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      url,
      article_id,
      height,
      width,
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
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/gallery-images/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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
