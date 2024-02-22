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

export async function getArticles(page = 1, pageSize = 12, articleType = null) {
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

export async function getFavoriteArticleByCountry(id: number) {
  const response = await fetch(`${apiUrl}/articles/country/top/${id}`);
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
