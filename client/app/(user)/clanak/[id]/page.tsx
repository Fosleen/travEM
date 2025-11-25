import { getArticleById } from "@/api/article";
import { getCountryPlaces } from "@/api/countries";
import Article from "@/components/user/pages/article/Article";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

// Generate metadata for SEO and link previews
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleById(Number(params.id));

  if (!article || article.error) {
    return {
      title: "Članak nije pronađen",
    };
  }

  const keywords = `putujem s travem, ${article.metatags}`;

  return {
    title: article.title || "putujEM s travEM",
    description: article.description || "Otkrijte svijet uz Emu i Matiju!",
    keywords: keywords,
    openGraph: {
      title: article.title || "putujEM s travEM",
      description: article.description || "Otkrijte svijet uz Emu i Matiju!",
      images: [article.main_image_url],
      type: "article",
      url: `https://your-domain.com/clanak/${params.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title || "putujEM s travEM",
      description: article.description || "Otkrijte svijet uz Emu i Matiju!",
      images: [article.main_image_url],
    },
  };
}

// Server component that fetches data
export default async function Page({ params }: Props) {
  const articleContent = await getArticleById(Number(params.id));

  if (!articleContent || articleContent.error) {
    notFound();
  }

  // Fetch country places if article has a placeId
  const countryPlaces = articleContent.placeId
    ? await getCountryPlaces(articleContent.placeId)
    : [];

  return (
    <Article
      initialArticle={articleContent}
      initialCountryPlaces={countryPlaces}
    />
  );
}
