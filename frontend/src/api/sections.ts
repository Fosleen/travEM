import { apiUrl } from "./api";

export async function addSection(
  text: string,
  subtitle: string,
  order: number,
  link_title: string,
  link_url: string,
  icon_id: number,
  article_id: number
) {
  const response = await fetch(`${apiUrl}/sections`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      text: text,
      subtitle: subtitle,
      order: order,
      link_title: link_title,
      link_url: link_url,
      section_icon_id: icon_id,
      article_id: article_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
