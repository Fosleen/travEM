//@ts-nocheck
import { apiUrl } from "./api";

export async function getSubscribers() {
  const response = await fetch(`${apiUrl}/subscribers`);
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
