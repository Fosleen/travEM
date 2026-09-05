import { apiUrl } from "./api";

export async function getPopupContent(noCache: boolean = false) {
  const response = await fetch(
    `${apiUrl}/popup-content?noCache=${noCache}`,
    { cache: "no-store" }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error fetching popup content");
  }

  return data;
}

export async function updatePopupImage(imageUrl: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const response = await fetch(`${apiUrl}/popup-content`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error updating popup content");
  }

  return data;
}
