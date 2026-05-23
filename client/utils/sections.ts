import { apiUrl } from "./api";

export async function addSection(
  text: string,
  subtitle: string,
  order: number,
  link_title: string,
  link_url: string,
  icon_id: number | null,
  article_id: number,
  show_visa_info: boolean = false,
  show_best_time_to_visit: boolean = false,
  show_country_language: boolean = false
) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/sections`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
      show_visa_info: show_visa_info,
      show_best_time_to_visit: show_best_time_to_visit,
      show_country_language: show_country_language,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }

  return data;
}

export async function updateSection(
  id: number,
  text: string,
  subtitle: string,
  order: number,
  link_title: string,
  link_url: string,
  icon_id: number | null,
  show_visa_info: boolean = false,
  show_best_time_to_visit: boolean = false,
  show_country_language: boolean = false
) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/sections/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      text: text,
      subtitle: subtitle,
      order: order,
      link_title: link_title,
      link_url: link_url,
      section_icon_id: icon_id,
      show_visa_info: show_visa_info,
      show_best_time_to_visit: show_best_time_to_visit,
      show_country_language: show_country_language,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }

  return data;
}

export async function deleteSection(id: number) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/sections/${id}`, {
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