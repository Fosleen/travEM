import { getHomepage } from "@/utils/homepage";
import { getHomepageArticles } from "@/utils/article";
import { Metadata } from "next";
import Homepage from "@/components/user/pages/homepage/Homepage";
import { SITE_URL } from "@/utils/site";
import { getFooterPartners } from "@/utils/footerPartners";

export async function generateMetadata(): Promise<Metadata> {
  const homepageContent = await getHomepage();

  return {
    title: "putujEM s travEM",
    description:
      "Otkrijte svijet uz Emu i Matiju! Najdetaljniji vodiči, povoljne karte i savjeti za savršeno putovanje.",
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: "putujEM s travEM",
      description:
        "Otkrijte svijet uz Emu i Matiju! Najdetaljniji vodiči, povoljne karte i savjeti za savršeno putovanje.",
      images: [homepageContent.hero_image_url],
      type: "website",
      url: SITE_URL,
    },
    twitter: {
      card: "summary_large_image",
      title: "putujEM s travEM",
      description:
        "Otkrijte svijet uz Emu i Matiju! Najdetaljniji vodiči, povoljne karte i savjeti za savršeno putovanje.",
      images: [homepageContent.hero_image_url],
    },
  };
}

export default async function Page() {
  const [homepageContent, articles, partners] = await Promise.all([
    getHomepage(),
    getHomepageArticles(),
    getFooterPartners().catch(() => []),
  ]);

  return (
    <Homepage
      initialContent={homepageContent}
      initialArticles={articles}
      initialPartners={partners}
    />
  );
}
