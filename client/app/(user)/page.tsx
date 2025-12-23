import { getHomepage } from "@/utils/homepage";
import { getHomepageArticles } from "@/utils/article";
import { Metadata } from "next";
import Homepage from "@/components/user/pages/homepage/Homepage";

export async function generateMetadata(): Promise<Metadata> {
  const homepageContent = await getHomepage();

  return {
    title: "putujEM s travEM",
    description:
      "Otkrijte svijet uz Emu i Matiju! Najdetaljniji vodiči, povoljne karte i savjeti za savršeno putovanje.",
    openGraph: {
      title: "putujEM s travEM",
      description:
        "Otkrijte svijet uz Emu i Matiju! Najdetaljniji vodiči, povoljne karte i savjeti za savršeno putovanje.",
      images: [homepageContent.hero_image_url],
      type: "website",
      url: "https://putujemstravem.com",
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
  const homepageContent = await getHomepage();
  const articles = await getHomepageArticles();

  return (
    <Homepage initialContent={homepageContent} initialArticles={articles} />
  );
}
