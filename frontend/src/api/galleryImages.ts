import { apiUrl } from "./api";

export async function addGalleryImage(url: string, article_id: number) {
  const response = await fetch(`${apiUrl}/gallery-images`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      url: url,
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