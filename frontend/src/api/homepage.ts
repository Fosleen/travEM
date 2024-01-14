import { apiUrl } from "./api";

export async function getHomepage() {
  const response = await fetch(`${apiUrl}/homepage`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updateHeroImage(url: string) {
  const response = await fetch(`${apiUrl}/homepage`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      hero_image_url: url,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
