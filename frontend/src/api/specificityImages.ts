import { apiUrl } from "./api";

export async function updateSpecificityImage(
  id: number,
  url: string,
  specificity_id: number
) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/specificity-images/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      url: url,
      specificity_id: specificity_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
