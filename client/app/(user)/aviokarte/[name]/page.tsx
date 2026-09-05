import { getArticlesByType, getRecommendedArticles } from "@/utils/article";
import AirplaneTickets from "@/components/user/pages/airplaneTickets/AirplaneTickets";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAirplaneTicketPromo } from "@/utils/airplaneTicketPromo";
import { SITE_URL } from "@/utils/site";
import { getAirportCities } from "@/utils/airportCities";
import { getAirportBannerImage } from "@/utils/airportBanner";
import { toUrlSlug } from "@/utils/url";

type Props = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;

  const decodedName = decodeURIComponent(name);
  const airports = await getAirportCities();
  const airport = Array.isArray(airports)
    ? airports.find((item: any) => toUrlSlug(item.name) === toUrlSlug(decodedName))
    : null;
  const cityName = airport?.name || decodedName;
  const imageUrl = getAirportBannerImage(airport?.banner_image_url);

  const title = `Aviokarte ${cityName} - putujEM s travEM`;
  const description = `Pronađite najbolje aviokarte za ${cityName}. Pratite najnovije ponude i letove.`;
  const keywords = `aviokarte, ${decodedName}, letovi, putovanje, putujemstravem, ${cityName}`;
  const canonicalUrl = `${SITE_URL}/aviokarte/${encodeURIComponent(
    decodedName
  )}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Aviokarte ${cityName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const { name } = await params;

  // Also decode in the page component
  const decodedName = decodeURIComponent(name);

  const [articlesData, promoData, airportsData] = await Promise.all([
    getArticlesByType(1, 12, 2),
    getAirplaneTicketPromo(),
    getAirportCities(),
  ]);

  if (!articlesData || articlesData.error) {
    notFound();
  }

  const airport = Array.isArray(airportsData)
    ? airportsData.find(
        (item: any) => toUrlSlug(item.name) === toUrlSlug(decodedName)
      )
    : null;

  if (!airport) notFound();

  const filteredTickets = articlesData.data.filter(
    (article: any) =>
      toUrlSlug(article.airport_city?.name || "") === toUrlSlug(airport.name)
  );

  let recommendedId = null;
  if (articlesData.data.length > 0) {
    const recommendedData = await getRecommendedArticles(
      articlesData.data[0].id,
      "article"
    );

    if (
      recommendedData &&
      !recommendedData.error &&
      recommendedData.length > 0
    ) {
      recommendedId = recommendedData[0].id;
    }
  }

  return (
    <AirplaneTickets
      initialTickets={filteredTickets}
      cityName={airport.name}
      heroImageUrl={getAirportBannerImage(airport.banner_image_url)}
      recommendedId={recommendedId}
      promo={promoData && !promoData.error ? promoData : null}
    />
  );
}
