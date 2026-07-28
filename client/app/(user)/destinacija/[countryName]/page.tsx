import { cache } from "react";
import { getCountriesByName, getCountryById } from "@/utils/countries";
import { getFavoriteArticleByCountry } from "@/utils/article";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import DestinationCountry from "@/components/user/pages/destinationCountry/DestinationCountry";
import { fromUrlSlug, toUrlSlug } from "@/utils/url";

type Props = {
  params: Promise<{ countryName: string }>;
};

const getCachedCountriesByName = cache(
  async (countryName: string, page: number, pageSize: number) => {
    return getCountriesByName(countryName, page, pageSize);
  }
);

const getCachedCountryById = cache(async (countryId: number) => {
  return getCountryById(countryId);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countryName } = await params;
  const decodedCountryName = fromUrlSlug(countryName);

  try {
    const tempData = await getCachedCountriesByName(decodedCountryName, 1, 1);

    if (!tempData || !tempData.data || tempData.data.length === 0) {
      return {
        title: "Država nije pronađena",
      };
    }

    const countryId = tempData.data[0].id;
    const country = await getCachedCountryById(countryId);

    if (!country || country.error) {
      return {
        title: "Država nije pronađena",
      };
    }

    const metaKeywords = `${country.name}, ${country.name} putovanje, ${country.name} putopis, ${country.name} travem, ${country.name} top 10 lokacija, putovanje u ${country.name}, ${country.name} što posjetiti`;
    const title = `putujEM s travEM - ${country.name}`;
    const description =
      country.description || "Otkrijte svijet uz Emu i Matiju!";
    const canonicalUrl = `https://www.putujemstravem.com/destinacija/${toUrlSlug(
      country.name
    )}`;

    return {
      title,
      description,
      keywords: metaKeywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        images: [country.main_image_url],
        type: "website",
        url: canonicalUrl,
        siteName: "putujEM s travEM",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [country.main_image_url],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    return {
      title: "putujEM s travEM",
    };
  }
}

export default async function Page({ params }: Props) {
  const { countryName } = await params;
  const decodedCountryName = fromUrlSlug(countryName);

  const tempData = await getCachedCountriesByName(decodedCountryName, 1, 1);

  if (!tempData || !tempData.data || tempData.data.length === 0) {
    notFound();
  }

  const countryId = tempData.data[0].id;
  const countryData = await getCachedCountryById(countryId);

  if (!countryData || countryData.error) {
    notFound();
  }

  const canonicalCountrySlug = toUrlSlug(countryData.name);

  if (countryName !== canonicalCountrySlug) {
    permanentRedirect(`/destinacija/${canonicalCountrySlug}`);
  }

  let favoriteArticle = null;

  try {
    const favoriteArticleData = await getFavoriteArticleByCountry(countryId);

    if (favoriteArticleData && "id" in favoriteArticleData) {
      favoriteArticle = favoriteArticleData;
    }
  } catch (error) {
    console.error("Error fetching favorite article:", error);
  }

  return (
    <DestinationCountry
      initialCountry={countryData}
      initialFavoriteArticle={favoriteArticle}
      countryName={decodedCountryName}
    />
  );
}
