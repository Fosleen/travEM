import { apiUrl } from "./api";

export async function addVideo(
  url: string,
  article_id: number,
  place_id: number,
  country_id: number
) {
  const response = await fetch(`${apiUrl}/videos`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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
