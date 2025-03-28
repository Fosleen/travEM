import { apiUrl } from "./api";

export async function addSectionImage(
  url: string,
  section_id: number,
  height: number,
  width: number
) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/section-images`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      url: url,
      section_id: section_id,
      height: height,
      width: width,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updateSectionImage(url: string, id: number) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/section-images/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      url: url,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function deleteSectionImage(id: number) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/section-images/${id}`, {
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
