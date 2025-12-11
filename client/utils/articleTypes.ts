import { apiUrl } from "./api";

export async function getArticleTypes() {
  const response = await fetch(`${apiUrl}/article-types`);
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
