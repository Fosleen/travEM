import { getArticleById } from "@/api/article";
import { getCountryPlaces } from "@/api/countries";
import Article from "@/components/user/pages/article/Article";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(Number(id));

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
      url: `https://putujemstravem.com/clanak/${id}`,
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
  const articleContent = await getArticleById(Number(id));

  if (!articleContent || articleContent.error) {
    notFound();
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
