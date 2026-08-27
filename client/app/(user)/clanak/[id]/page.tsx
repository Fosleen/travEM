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

const getDateValue = (value: unknown): string | undefined => {
  if (!value) return undefined;

  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const getArticleDates = (article: any) => {
  const publishedTime = getDateValue(
    article.date_written ?? article.dateWritten
  );
  const modifiedTime = getDateValue(
    article.date_updated ?? article.dateUpdated
  );

  return {
    publishedTime,
    modifiedTime: modifiedTime ?? publishedTime,
  };
};

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
  const { publishedTime, modifiedTime } = getArticleDates(article);

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
      publishedTime,
      modifiedTime,
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

  const canonicalUrl = `${SITE_URL}/clanak/${
    articleContent.slug || articleContent.id
  }`;
  const { publishedTime, modifiedTime } = getArticleDates(articleContent);
  const authorName =
    articleContent.user?.username === "Dox" ||
    articleContent.user?.username === "Ema"
      ? "putujEM s travEM - Ema i Matija"
      : `${articleContent.user?.first_name || ""} ${
          articleContent.user?.last_name || ""
        }`.trim() || "putujEM s travEM";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: articleContent.title,
    description: articleContent.description,
    image: articleContent.main_image_url
      ? [articleContent.main_image_url]
      : undefined,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "putujEM s travEM",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/travem-logo-grey.webp`,
      },
    },
    url: canonicalUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Article
        initialArticle={articleContent}
        initialCountryPlaces={countryPlaces}
      />
    </>
  );
}
