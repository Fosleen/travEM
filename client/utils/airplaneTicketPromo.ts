import { apiUrl } from "./api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt");
  }
  return null;
};

export async function getAirplaneTicketPromo(
  noCache: boolean = false,
  includeScheduled: boolean = noCache
) {
  try {
    const token = getToken();

    const response = await fetch(
      `${apiUrl}/airplane-ticket-promo?noCache=${noCache}${
        includeScheduled ? "&includeScheduled=true" : ""
      }`,
      {
        cache: "no-store",
        headers:
          includeScheduled && token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching airplane ticket promo:", error);
    return { error: error.message };
  }
}

export async function updateAirplaneTicketPromo(
  top_text: string,
  middle_text: string,
  button_text: string,
  article_id: number
) {
  const token = getToken();

  const response = await fetch(`${apiUrl}/airplane-ticket-promo`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      top_text,
      middle_text,
      button_text,
      article_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data.error);
    return data.error;
  }

  return data;
}
