// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { token } from "../utils/global";
import { apiUrl } from "./api";

export async function addArticle(
  title: string,
  subtitle: string,
  description: string,
  video: string,
  article_type_id: number,
  country_id: numberr | null,
  place_id: numberr | null,
  main_image_url: string,
  user_id: number,
  date_written: Date,
  airport_city_id: numberr | null
) {
  const response = await fetch(`${apiUrl}/articles`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
      airport_city_id: airport_city_id,
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

export async function getArticles(
  page = 1,
  pageSize = 12,
  articleType: number | null = null
) {
  const response = await fetch(
    `${apiUrl}/articles?page=${page}&pageSize=${pageSize}&articleType=${articleType}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getArticlesByType(
  page = 1,
  pageSize = 8,
  article_type: number
) {
  const response = await fetch(
    `${apiUrl}/articles?page=${page}&pageSize=${pageSize}&articleType=${article_type}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getHomepageArticles() {
  const response = await fetch(`${apiUrl}/articles/homepage`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getRecommendedArticles(id: number, type: string) {
  const response = await fetch(
    `${apiUrl}/articles/recommended/${id}?type=${type}`
  );
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updateOrCreateTopHomepageArticles(
  articleIds: Array<number>,
  specialTypeId: number
) {
  const response = await fetch(`${apiUrl}/articles/homepage/${specialTypeId}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify({
      article_id: articleIds,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getArticleById(id: number) {
  const response = await fetch(`${apiUrl}/articles/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updateArticle(
  id: number,
  title: string,
  subtitle: string,
  description: string,
  main_image_url: string,
  article_type_id: number,
  country_id: number | null | string,
  place_id: number | null | string,
  airport_city_id: number | null
) {
  const requestBody = {
    title: title,
    subtitle: subtitle,
    description: description,
    main_image_url: main_image_url,
    article_type_id: article_type_id,
    airport_city_id: airport_city_id,
    country_id: country_id,
    place_id: place_id,
  };

  const response = await fetch(`${apiUrl}/articles/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify(requestBody),
  });
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function deleteArticleById(id: number) {
  const response = await fetch(`${apiUrl}/articles/${id}`, {
    method: "DELETE",
    Authorization: `Bearer ${token}`,
  });
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getFavoriteArticleByCountry(id: number) {
  const response = await fetch(`${apiUrl}/articles/country/top/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
