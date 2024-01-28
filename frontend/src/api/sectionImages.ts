import { apiUrl } from "./api";

export async function addSectionImage(url: string, section_id: number) {
  const response = await fetch(`${apiUrl}/section-images`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      url: url,
      section_id: section_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
