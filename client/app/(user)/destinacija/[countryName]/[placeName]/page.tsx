import { getPlacesByName } from "@/utils/places";
import DestinationPlace from "@/components/user/pages/destinationPlace/DestinationPlace";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ placeName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { placeName } = await params;

  try {
    const data = await getPlacesByName(placeName, 1, 1);

    if (!data || !data.data || data.data.length === 0) {
      return {
        title: "Lokacija nije pronađena",
      };
    }

    const place = data.data[0];

    const metaKeywords = `${place.name}, ${place.country.name}, ${place.name} ${place.country.name}, ${place.name} putovanje, ${place.name} putopis, ${place.name} što posjetiti, ${place.name} travem`;
    const title = `putujEM s travEM - ${place.name}, ${place.country.name}`;
    const description = place.description || "Otkrijte svijet uz Emu i Matiju!";

    return {
      title: title,
      description: description,
      keywords: metaKeywords,
      openGraph: {
        title: title,
        description: description,
        images: [place.main_image_url],
        type: "website",
        url: `https://putujemstravem.com/destinacija/lokacija/${placeName}`,
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
  const { placeName } = await params;

  const data = await getPlacesByName(placeName, 1, 1);

  if (!data || !data.data || data.data.length === 0) {
    notFound();
  }

  const place = data.data[0];

  return <DestinationPlace initialPlace={place} placeName={placeName} />;
}
