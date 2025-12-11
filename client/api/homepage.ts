import { apiUrl } from "./api";

// Helper function to get token (only on client side)
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt");
  }
  return null;
};

export async function getHomepage(noCache: boolean = false) {
  const response = await fetch(`${apiUrl}/homepage?noCache=${noCache}`, {
    cache: "no-store", // ← Disable Next.js cache
  });
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function getHomepageStats(noCache: boolean = false) {
  const response = await fetch(`${apiUrl}/homepage/stats?noCache=${noCache}`, {
    cache: "no-store", // ← Disable Next.js cache
  });
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updateHeroImage(url: string) {
  const token = getToken();

  const response = await fetch(`${apiUrl}/homepage`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      hero_image_url: url,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updateBanner(
  banner_title: string,
  banner_small_text: string,
  banner_description: string,
  button_text: string,
  banner_image_url: string,
  button_url: string
) {
  const token = getToken();

  const response = await fetch(`${apiUrl}/homepage`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      banner_title: banner_title,
      banner_small_text: banner_small_text,
      banner_description: banner_description,
      button_text: button_text,
      banner_image_url: banner_image_url,
      button_url: button_url,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}

export async function updateStats(
  flights_nmbr: string,
  videos_nmbr: string,
  distance_nmbr: string
) {
  const token = getToken();

  const response = await fetch(`${apiUrl}/homepage`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      flights_nmbr: flights_nmbr,
      videos_nmbr: videos_nmbr,
      distance_nmbr: distance_nmbr,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }
  return data;
}
