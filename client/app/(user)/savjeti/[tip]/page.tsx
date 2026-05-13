import { getArticleTypes } from "@/utils/articleTypes";
import {
  getArticleById,
  getArticles,
  getRecommendedArticles,
  getTipsFeaturedArticle,
} from "@/utils/article";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { convertFromSlug } from "@/utils/global";
import TipsAndTricks from "@/components/user/pages/tipsAndTricks/TipsAndTricks";

type Props = {
  params: Promise<{ tip: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tip } = await params;

  try {
    const articleTypes = await getArticleTypes();
    const selectedType = articleTypes?.find((el: any) => el.name === tip);

    if (!selectedType) {
      return {
        title: "Savjeti nisu pronađeni - putujEM s travEM",
      };
    }

    const title = `${convertFromSlug(selectedType.name)} - putujEM s travEM`;
    const description =
      selectedType.description || "Savjeti i trikovi za putovanja";

    return {
      title: title,
      description: description,
      keywords: `${convertFromSlug(
        selectedType.name
      )}, savjeti za putovanja, putovanje, travem, tips, tricks`,
      openGraph: {
        title: title,
        description: description,
        type: "website",
        url: `https://putujemstravem.com/savjeti/${tip}`,
        siteName: "putujEM s travEM",
        images: [
          {
            url: "https://putujemstravem.com/default-og-image.jpg",
            width: 1200,
            height: 630,
            alt: `${convertFromSlug(selectedType.name)} - putujEM s travEM`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "putujEM s travEM",
    };
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { tip } = await params;
  const search = await searchParams;
  const currentPage = parseInt(search.page || "1", 10);

  const articleTypes = await getArticleTypes();

  if (!articleTypes || articleTypes.error) {
    notFound();
  }

  const selectedArticleType = articleTypes.find((el: any) => el.name === tip);

  if (!selectedArticleType) {
    notFound();
  }

  let initialArticles = null;
  let initialTotalPages = 1;
  let initialFeaturedArticle = null;
  let recommendedBaseArticleId = null;

  try {
    const [articlesData, featuredArticleData] = await Promise.all([
      getArticles(currentPage, 7, selectedArticleType.id),
      getTipsFeaturedArticle(selectedArticleType.id),
    ]);

    if (articlesData && !articlesData.error) {
      initialArticles = articlesData.data || [];
      initialTotalPages = articlesData.totalPages || 1;
    }

    if (featuredArticleData && !featuredArticleData.error) {
      const fullFeaturedArticle = await getArticleById(
        featuredArticleData.id,
        true
      );

      if (fullFeaturedArticle && !fullFeaturedArticle.error) {
        initialFeaturedArticle = fullFeaturedArticle;
      } else {
        initialFeaturedArticle = featuredArticleData;
      }

      recommendedBaseArticleId = featuredArticleData.id;
    }

    if (!recommendedBaseArticleId && initialArticles?.length > 0) {
      recommendedBaseArticleId = initialArticles[0].id;
    }
  } catch (error) {
    console.error("Error fetching tips and tricks data:", error);
  }

  let recommendedArticles = null;

  if (recommendedBaseArticleId) {
    try {
      const recommended = await getRecommendedArticles(
        recommendedBaseArticleId,
        "article"
      );
      recommendedArticles = recommended || [];
    } catch (error) {
      console.error("Error fetching recommended articles:", error);
    }
  }

  return (
    <TipsAndTricks
      initialArticleTypes={articleTypes}
      initialSelectedType={selectedArticleType}
      initialArticles={initialArticles}
      initialFeaturedArticle={initialFeaturedArticle}
      initialTotalPages={initialTotalPages}
      initialRecommendedArticles={recommendedArticles}
      initialPage={currentPage}
      tip={tip}
    />
  );
}