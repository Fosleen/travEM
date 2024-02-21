import { apiUrl } from "./api";

export async function getFooter() {
  const response = await fetch(`${apiUrl}/footer`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updateFooter(image_url: string) {
  const response = await fetch(`${apiUrl}/footer`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      image_url: image_url,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
