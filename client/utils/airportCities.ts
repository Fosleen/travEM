import { apiUrl } from "./api";
import { AirportCityData } from "@/common/types";

const authHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

const parseResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
};

export async function getAirportCities(admin = false) {
  try {
    const response = await fetch(
      `${apiUrl}/airport-cities${admin ? "/admin" : ""}`,
      admin
        ? { cache: "no-store", headers: authHeaders() }
        : { cache: "no-store" }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching airport cities:", error);
    if (admin) throw error;
    return { error: error.message };
  }
}

export async function createAirportCity(
  payload: Omit<AirportCityData, "id">
): Promise<AirportCityData> {
  return parseResponse(await fetch(`${apiUrl}/airport-cities`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  }));
}

export async function updateAirportCity(
  id: number,
  payload: Partial<AirportCityData>
): Promise<AirportCityData> {
  return parseResponse(await fetch(`${apiUrl}/airport-cities/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  }));
}
