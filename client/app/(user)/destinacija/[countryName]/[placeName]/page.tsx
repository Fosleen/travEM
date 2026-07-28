import { getPlacesByName } from "@/utils/places";
import DestinationPlace from "@/components/user/pages/destinationPlace/DestinationPlace";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { fromUrlSlug, toUrlSlug } from "@/utils/url";

type Props = {
  params: Promise<{ countryName: string; placeName: string }>;
};

const getPlaceForRoute = cache(
  async (countrySlug: string, placeSlug: string) => {
    const data = await getPlacesByName(fromUrlSlug(placeSlug), 1, 200);
    const places = Array.isArray(data?.data) ? data.data : [];

    return places.find(
      (place: any) =>
        toUrlSlug(place.name) === toUrlSlug(placeSlug) &&
        toUrlSlug(place.country?.name || "") === toUrlSlug(countrySlug)
    );
  }
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countryName, placeName } = await params;

  try {
    const place = await getPlaceForRoute(countryName, placeName);

    if (!place) {
      return {
        title: "Lokacija nije pronađena",
      };
    }

    const metaKeywords = `${place.name}, ${place.country.name}, ${place.name} ${place.country.name}, ${place.name} putovanje, ${place.name} putopis, ${place.name} što posjetiti, ${place.name} travem`;
    const title = `putujEM s travEM - ${place.name}, ${place.country.name}`;
    const description = place.description || "Otkrijte svijet uz Emu i Matiju!";
    const canonicalPath = `/destinacija/${toUrlSlug(
      place.country.name
    )}/${toUrlSlug(place.name)}`;

    return {
      title: title,
      description: description,
      keywords: metaKeywords,
      alternates: {
        canonical: `https://www.putujemstravem.com${canonicalPath}`,
      },
      openGraph: {
        title: title,
        description: description,
        images: [place.main_image_url],
        type: "website",
        url: `https://www.putujemstravem.com${canonicalPath}`,
        siteName: "putujEM s travEM",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [place.main_image_url],
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
  const { countryName, placeName } = await params;
  const place = await getPlaceForRoute(countryName, placeName);

  if (!place) {
    notFound();
  }

  const canonicalCountrySlug = toUrlSlug(place.country.name);
  const canonicalPlaceSlug = toUrlSlug(place.name);

  if (
    countryName !== canonicalCountrySlug ||
    placeName !== canonicalPlaceSlug
  ) {
    permanentRedirect(
      `/destinacija/${canonicalCountrySlug}/${canonicalPlaceSlug}`
    );
  }

  return <DestinationPlace initialPlace={place} placeName={placeName} />;
}
