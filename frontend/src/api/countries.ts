import { apiUrl } from "./api";

export async function getCountries(page = 1, pageSize = 12) {
  const response = await fetch(
    `${apiUrl}/countries?page=${page}&pageSize=${pageSize}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getCountriesByName(
  name: string,
  page = 1,
  pageSize = 12
) {
  console.log(name, page, pageSize);

  const response = await fetch(
    `${apiUrl}/countries/search/${name}?page=${page}&pageSize=${pageSize}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
