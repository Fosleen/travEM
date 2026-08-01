import { MetadataRoute } from "next";
import { apiUrl } from "@/utils/api";
import { toUrlSlug } from "@/utils/url";
import { SITE_URL } from "@/utils/site";

type ListResponse<T> = { data?: T[] } | T[];

async function fetchList<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`Sitemap fetch failed: ${response.status} ${endpoint}`);
      return [];
    }

    const payload: ListResponse<T> = await response.json();

    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload.data && Array.isArray(payload.data)) {
      return payload.data;
    }

    return [];
  } catch (error) {
    console.error(`Sitemap fetch error for ${endpoint}:`, error);
    return [];
  }
}

const toDate = (value: unknown, fallback: Date) =>
  value ? new Date(value as string) : fallback;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [articles, continents, countries, places, articleTypes, airportCities] =
    await Promise.all([
      fetchList<any>("/articles?page=1&pageSize=5000"),
      fetchList<any>("/continents?noCache=1"),
      fetchList<any>("/countries?page=1&pageSize=500&noCache=1"),
      fetchList<any>("/places?page=1&pageSize=500"),
      fetchList<any>("/article-types"),
      fetchList<any>("/airport-cities"),
    ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/kontakt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/pravila-o-privatnosti`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/uvjeti-koristenja`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = (articles || [])
    .filter((article: any) => article?.id)
    .map((article: any) => ({
      url: `${SITE_URL}/clanak/${article.id}`,
      lastModified: toDate(
        article.updated_at ??
          article.updatedAt ??
          article.date_written ??
          article.dateWritten,
        now
      ),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const continentPages: MetadataRoute.Sitemap = (continents || [])
    .filter((continent: any) => continent?.id)
    .map((continent: any) => ({
      url: `${SITE_URL}/kontinent/${continent.id}`,
      lastModified: toDate(continent.updated_at ?? continent.updatedAt, now),
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  const countryPages: MetadataRoute.Sitemap = (countries || [])
    .filter((country: any) => country?.name)
    .map((country: any) => {
      const slug = toUrlSlug(String(country.name));
      return {
        url: `${SITE_URL}/destinacija/${slug}`,
        lastModified: toDate(country.updated_at ?? country.updatedAt, now),
        changeFrequency: "weekly",
        priority: 0.6,
      };
    });

  const placePages: MetadataRoute.Sitemap = (places || [])
    .filter((place: any) => place?.name && place?.country?.name)
    .map((place: any) => {
      const countrySlug = toUrlSlug(String(place.country.name));
      const placeSlug = toUrlSlug(String(place.name));

      return {
        url: `${SITE_URL}/destinacija/${countrySlug}/${placeSlug}`,
        lastModified: toDate(place.updated_at ?? place.updatedAt, now),
        changeFrequency: "weekly",
        priority: 0.6,
      };
    });

  const tipPages: MetadataRoute.Sitemap = (articleTypes || [])
    .filter((type: any) => type?.name)
    .map((type: any) => ({
      url: `${SITE_URL}/savjeti/${encodeURIComponent(String(type.name))}`,
      lastModified: toDate(type.updated_at ?? type.updatedAt, now),
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  const airplanePages: MetadataRoute.Sitemap = (airportCities || [])
    .filter((city: any) => city?.name)
    .map((city: any) => ({
      url: `${SITE_URL}/aviokarte/${encodeURIComponent(
        String(city.name).toLowerCase()
      )}`,
      lastModified: toDate(city.updated_at ?? city.updatedAt, now),
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  return [
    ...staticPages,
    ...articlePages,
    ...continentPages,
    ...countryPages,
    ...placePages,
    ...tipPages,
    ...airplanePages,
  ];
}
