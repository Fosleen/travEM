// app/kontinent/[id]/page.tsx
import { getContinentById } from "@/api/continents";
import { getCountriesByContinent } from "@/api/countries";
import Continent from "@/components/user/pages/continent/Continent";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const continent = await getContinentById(parseInt(id));

  if (!continent || continent.error) {
    return {
      title: "Kontinent nije pronađen",
    };
  }

  const title = `${continent.name} - putujEM s travEM`;
  const description =
    continent.description ||
    `Otkrijte destinacije na kontinentu ${continent.name}. Pratite naša putovanja i savjete.`;
  const keywords = `${continent.name}, putovanje, destinacije, putujemstravem`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://putujemstravem.com/kontinent/${id}`,
      images: [
        {
          url:
            continent.image_url ||
            "https://putujemstravem.com/default-og-image.jpg",
          width: 1200,
          height: 630,
          alt: continent.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        continent.image_url ||
          "https://putujemstravem.com/default-og-image.jpg",
      ],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const continent = await getContinentById(parseInt(id));

  if (!continent || continent.error) {
    notFound();
  }

  const countriesData = await getCountriesByContinent(parseInt(id));

  if (!countriesData || countriesData.error) {
    notFound();
  }

  interface Country {
    id: number;
    name: string;
    description: string;
  }

  const sortedCountries = countriesData.sort((a: Country, b: Country) =>
    a.name.localeCompare(b.name)
  );

  return (
    <Continent
      initialContinent={continent}
      initialCountries={sortedCountries}
    />
  );
}
