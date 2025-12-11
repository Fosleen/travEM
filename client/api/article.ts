// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { apiUrl } from "./api";

// Helper function to get token (only on client side)
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt");
  }
  return null;
};

// api/article.ts

export async function getArticleById(id: number, noCache: boolean = false) {
  try {
    console.log(`Fetching article ${id} from ${apiUrl}/articles/${id}`);

    const response = await fetch(
      `${apiUrl}/articles/${id}?noCache=${noCache}`,
      {
        cache: "no-store", // ← Always fetch from server (Redis will cache it)
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return { error: true, message: errorText };
    }

    const data = await response.json();
    console.log("Article fetched successfully:", data.title);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: true, message: error.message };
  }
}

export async function getArticlesByType(
  page = 1,
  pageSize = 8,
  article_type: number
) {
  try {
    const response = await fetch(
      `${apiUrl}/articles?page=${page}&pageSize=${pageSize}&articleType=${article_type}`,
      {
        cache: "no-store", // ← Disable Next.js cache
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching articles by type:", error);
    return { error: error.message };
  }
}

export async function getRecommendedArticles(id: number, type: string) {
  try {
    const response = await fetch(
      `${apiUrl}/articles/recommended/${id}?type=${type}`,
      {
        cache: "no-store", // ← Disable Next.js cache
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recommended articles:", error);
    return { error: error.message };
  }
}

export async function getArticlesByName(name: string, page = 1, pageSize = 12) {
  try {
    const response = await fetch(
      `${apiUrl}/articles/search/${name}?page=${page}&pageSize=${pageSize}`,
      {
        cache: "no-store", // ← Disable Next.js cache
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching articles by name:", error);
    return { error: error.message };
  }
}

export async function getArticles(
  page = 1,
  pageSize = 12,
  articleType: number | null = null
) {
  try {
    const response = await fetch(
      `${apiUrl}/articles?page=${page}&pageSize=${pageSize}&articleType=${articleType}`,
      {
        cache: "no-store", // ← Disable Next.js cache
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { error: error.message };
  }
}

export async function getHomepageArticles(noCache: boolean = false) {
  try {
    const response = await fetch(
      `${apiUrl}/articles/homepage?noCache=${noCache}`,
      {
        cache: "no-store", // ← Disable Next.js cache, rely on Redis
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching homepage articles:", error);
    return { error: error.message };
  }
}

export async function getFavoriteArticleByCountry(
  id: number,
  noCache: boolean = false
) {
  try {
    const response = await fetch(
      `${apiUrl}/articles/country/top/${id}?noCache=${noCache}`,
      {
        cache: "no-store", // ← Disable Next.js cache
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching favorite article:", error);
    return { error: error.message };
  }
}

// Keep the rest of your mutations (POST, PATCH, DELETE) as they are
// They already don't use caching

export async function addArticle(
  title: string,
  subtitle: string,
  description: string,
  video: string,
  metatags: string,
  article_type_id: number,
  country_id: number | null,
  place_id: number | null,
  main_image_url: string,
  user_id: number,
  date_written: Date,
  airport_city_id: number | null
) {
  const token = getToken();

  const response = await fetch(`${apiUrl}/articles`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      title,
      subtitle,
      description,
      video,
      metatags,
      article_type_id,
      country_id,
      place_id,
      user_id,
      main_image_url,
      date_written,
      airport_city_id,
    }),
  });

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
  const token = getToken();

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

export async function updateArticle(
  id: number,
  title: string,
  subtitle: string,
  description: string,
  metatags: string,
  main_image_url: string,
  article_type_id: number,
  country_id: number | null | string,
  place_id: number | null | string,
  airport_city_id: number | null
) {
  const requestBody = {
    title,
    subtitle,
    description,
    metatags,
    main_image_url,
    article_type_id,
    airport_city_id,
    country_id,
    place_id,
  };

  const token = getToken();

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
  console.log("data", data);

  return data;
}

export async function deleteArticleById(id: number) {
  const token = getToken();

  const response = await fetch(`${apiUrl}/articles/${id}`, {
    headers: {
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

export async function createTopCountryArticle(articleId: number) {
  const token = getToken();

  const response = await fetch(`${apiUrl}/articles/country/top`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify({
      article_id: articleId,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function removeTopCountryArticle(articleId: number) {
  const token = getToken();

  const response = await fetch(`${apiUrl}/articles/country/top/${articleId}`, {
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
