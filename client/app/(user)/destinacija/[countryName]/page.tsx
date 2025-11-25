import { getCountriesByName, getCountryById } from "@/api/countries";
import { getFavoriteArticleByCountry } from "@/api/article";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import DestinationCountry from "@/components/user/pages/destinationCountry/DestinationCountry";

type Props = {
  params: Promise<{ countryName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countryName } = await params;

  try {
    const tempData = await getCountriesByName(countryName, 1, 1);

    if (!tempData || !tempData.data || tempData.data.length === 0) {
      return {
        title: "Država nije pronađena",
      };
    }

    const countryId = tempData.data[0].id;
    const country = await getCountryById(countryId);

    if (!country || country.error) {
      return {
        title: "Država nije pronađena",
      };
    }

    const metaKeywords = `${country.name}, ${country.name} putovanje, ${country.name} putopis, ${country.name} travem, ${country.name} top 10 lokacija, putovanje u ${country.name}, ${country.name} što posjetiti`;
    const title = `putujEM s travEM - ${country.name}`;
    const description =
      country.description || "Otkrijte svijet uz Emu i Matiju!";

    return {
      title: title,
      description: description,
      keywords: metaKeywords,
      openGraph: {
        title: title,
        description: description,
        images: [country.main_image_url],
        type: "website",
        url: `https://putujemstravem.com/destinacija/${countryName}`,
        siteName: "putujEM s travEM",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
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

  const tempData = await getCountriesByName(countryName, 1, 1);

  if (!tempData || !tempData.data || tempData.data.length === 0) {
    notFound();
  }

  const countryId = tempData.data[0].id;
  const countryData = await getCountryById(countryId);

  if (!countryData || countryData.error) {
    notFound();
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
      countryName={countryName}
    />
  );
}
