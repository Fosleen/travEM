//@ts-nocheck
import { apiUrl } from "./api";

export async function getSubscribers(page = 1, pageSize = 12) {
  const response = await fetch(
    `${apiUrl}/subscribers?page=${page}&pageSize=${pageSize}`
  );

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getSubscribersStats() {
  const response = await fetch(
    `${apiUrl}/subscribers/new-subscribers-previous-period`
  );

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getSubscribersWithoutPagination() {
  const response = await fetch(`${apiUrl}/subscribers/no-pagination`);

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function sendNewsletterToSubscribers(subscribers, article) {
  const response = await fetch(`${apiUrl}/subscribers/send-newsletter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscribers, article }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    throw new Error(data.error);
  }

  return data;
}

export async function addSubscriber(email) {
  const response = await fetch(`${apiUrl}/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    throw new Error(data.error);
  }

  return data;
}

export async function deleteSubscriber(id: number) {
  const token = localStorage.getItem("jwt");

  const response = await fetch(`${apiUrl}/subscribers/${id}`, {
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
