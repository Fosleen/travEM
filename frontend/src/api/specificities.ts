import { apiUrl } from "./api";

export async function addSpecificity(
  title: string,
  country_id: number,
  items: Array<{ title: string; description: string }>,
  images: Array<string>
) {
  const response = await fetch(`${apiUrl}/specificities`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      title: title,
      country_id: country_id,
      items: items,
      images: images,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updateSpecificity(id: number, title: string) {
  const response = await fetch(`${apiUrl}/specificities/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      title: title,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
