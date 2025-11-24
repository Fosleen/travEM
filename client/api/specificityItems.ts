import { apiUrl } from "./api";

export async function addSpecificityItem(
  title: string,
  description: string,
  specificity_id: number
) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/specificity-items`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      title: title,
      description: description,
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

export async function updateSpecificityItem(
  id: number,
  title: string,
  description: string
) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/specificity-items/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      title: title,
      description: description,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function deleteSpecificityItem(id: number) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/specificity-items/${id}`, {
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
