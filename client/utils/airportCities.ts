import { apiUrl } from "./api";

export async function getAirportCities() {
  try {
    const response = await fetch(`${apiUrl}/airport-cities`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching airport cities:", error);
    return { error: error.message };
  }
}
