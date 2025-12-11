// api/continents.ts
import { apiUrl } from "./api";

export async function getContinents(noCache: boolean = false) {
  try {
    const response = await fetch(`${apiUrl}/continents?noCache=true`, {
      next: { revalidate: noCache ? 0 : 0 },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching continents:", error);
    return { error: error.message };
  }
}

export async function getContinentById(id: number) {
  try {
    const response = await fetch(`${apiUrl}/continents/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      return { error: errorData.error };
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching continent:", error);
    return { error: error.message };
  }
}
