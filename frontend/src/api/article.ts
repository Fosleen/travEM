import { apiUrl } from "./api";

export async function addArticle(
  flights_nmbr: string,
  videos_nmbr: string,
  distance_nmbr: string
) {
    
  const response = await fetch(`${apiUrl}/homepage`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      flights_nmbr: flights_nmbr,
      videos_nmbr: videos_nmbr,
      distance_nmbr: distance_nmbr,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
