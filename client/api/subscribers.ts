import { apiUrl } from "./api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt");
  }
  return null;
};

export async function getSubscribers(
  page = 1,
  pageSize = 12,
  noCache: boolean = false
) {
  try {
    const token = getToken();
    const response = await fetch(
      `${apiUrl}/subscribers?page=${page}&pageSize=${pageSize}&noCache=${noCache}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        next: { revalidate: noCache ? 0 : 300 },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.log(data.error);
      return { error: data.error };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return { error: error.message };
  }
}

export async function getSubscribersStats() {
  try {
    const token = getToken();
    const response = await fetch(
      `${apiUrl}/subscribers/new-subscribers-previous-period`,
      {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.log(data.error);
      return { error: data.error };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching subscriber stats:", error);
    return { error: error.message };
  }
}

export async function getSubscribersWithoutPagination() {
  try {
    const token = getToken();
    const response = await fetch(`${apiUrl}/subscribers/no-pagination`, {
      headers: {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const data = await response.json();
      console.log(data.error);
      return { error: data.error };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return { error: error.message };
  }
}

export async function sendNewsletterToSubscribers(
  subscribers: Array<any>,
  article: any
) {
  try {
    const token = getToken();
    const response = await fetch(`${apiUrl}/subscribers/send-newsletter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ subscribers, article }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to send newsletter");
    }

    const data = await response.json();
    console.log("Newsletter sending started", data);
    return data;
  } catch (error) {
    console.error("Error starting newsletter:", error);
    throw error;
  }
}

export async function addSubscriber(email: string) {
  try {
    const response = await fetch(`${apiUrl}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.log(data.error);
      throw new Error(data.error);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding subscriber:", error);
    throw error;
  }
}

export async function deleteSubscriber(id: number) {
  try {
    const token = getToken();
    const response = await fetch(`${apiUrl}/subscribers/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      console.log(data.error);
      return { error: data.error };
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return { error: error.message };
  }
}

export async function unsubscribeUser(token: string) {
  try {
    const response = await fetch(
      `${apiUrl}/subscribers/unsubscribe?userToken=${encodeURIComponent(
        token
      )}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.error(data.error);
      throw new Error(data.error || "Failed to unsubscribe");
    }

    return await response.json();
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    throw error;
  }
}
