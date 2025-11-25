import { getArticlesByType, getRecommendedArticles } from "@/api/article";
import AirplaneTickets from "@/components/user/pages/airplaneTickets/AirplaneTickets";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;

  const decodedName = decodeURIComponent(name);
  const cityName = decodedName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const title = `Aviokarte ${cityName} - putujEM s travEM`;
  const description = `Pronađite najbolje aviokarte za ${cityName}. Pratite najnovije ponude i letove.`;
  const keywords = `aviokarte, ${decodedName}, letovi, putovanje, putujemstravem, ${cityName}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://putujemstravem.com/aviokarte/${name}`,
      images: [
        {
          url: "https://putujemstravem.com/default-og-image.jpg",
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
      images: ["https://putujemstravem.com/default-og-image.jpg"],
    },
  };
}

export default async function Page({ params }: Props) {
  const { name } = await params;

  // Also decode in the page component
  const decodedName = decodeURIComponent(name);

  const articlesData = await getArticlesByType(1, 12, 2);

  if (!articlesData || articlesData.error) {
    notFound();
  }

  const filteredTickets = articlesData.data.filter(
    (article) =>
      article.airport_city?.name?.toLowerCase() === decodedName.toLowerCase()
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
      cityName={decodedName}
      recommendedId={recommendedId}
    />
  );
}
