import { apiUrl } from "./api";

export async function addCharacteristic(
  title: string,
  description: string,
  country_id: number,
  characteristic_icon_id: number
) {
  const response = await fetch(`${apiUrl}/characteristics`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      title: title,
      description: description,
      country_id: country_id,
      characteristic_icon_id: characteristic_icon_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updateCharacteristic(
  id: number,
  title: string,
  description: string,
  characteristic_icon_id: number
) {
  const response = await fetch(`${apiUrl}/characteristics/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      title: title,
      description: description,
      characteristic_icon_id: characteristic_icon_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
