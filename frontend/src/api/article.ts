import { apiUrl } from "./api";

export async function addArticle(
  title: string,
  subtitle: string,
  description: string,
  video: string,
  article_type_id: number,
  country_id: number,
  place_id: number,
  main_image_url: string,
  user_id: number,
  date_written: Date
) {
  const response = await fetch(`${apiUrl}/articles`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      title: title,
      subtitle: subtitle,
      description: description,
      video: video,
      article_type_id: article_type_id,
      country_id: country_id,
      place_id: place_id,
      user_id: user_id,
      main_image_url: main_image_url,
      date_written: date_written,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getArticlesByName(name: string, page = 1, pageSize = 12) {
  const response = await fetch(
    `${apiUrl}/articles/search/${name}?page=${page}&pageSize=${pageSize}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getArticles(page = 1, pageSize = 12) {
  const response = await fetch(
    `${apiUrl}/articles?page=${page}&pageSize=${pageSize}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getFavoriteArticleByCountry(id) {
  const response = await fetch(`${apiUrl}/articles/country/top/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
