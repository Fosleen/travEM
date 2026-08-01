import { getArticleById, getArticleBySlug } from "@/utils/article";
import { getCountryPlaces } from "@/utils/countries";
import Article from "@/components/user/pages/article/Article";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { SITE_URL } from "@/utils/site";
import { cache } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const getArticleForPublicRoute = cache(async (value: string) => {
  return /^\d+$/.test(value)
    ? getArticleById(Number(value))
    : getArticleBySlug(value);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleForPublicRoute(id);

  if (!article || article.error) {
    return {
      title: "Članak nije pronađen",
    };
  }

  const keywords = `putujem s travem, ${article.metatags}`;
  const canonicalUrl = `${SITE_URL}/clanak/${article.slug || article.id}`;

  return {
    title: article.title || "putujEM s travEM",
    description: article.description || "Otkrijte svijet uz Emu i Matiju!",
    keywords: keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: article.title || "putujEM s travEM",
      description: article.description || "Otkrijte svijet uz Emu i Matiju!",
      images: [article.main_image_url],
      type: "article",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title || "putujEM s travEM",
      description: article.description || "Otkrijte svijet uz Emu i Matiju!",
      images: [article.main_image_url],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const articleContent = await getArticleForPublicRoute(id);

  if (!articleContent || articleContent.error) {
    notFound();
  }

  if (articleContent.slug && id !== articleContent.slug) {
    permanentRedirect(`/clanak/${articleContent.slug}`);
  }

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
