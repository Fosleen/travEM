import type { Metadata } from "next";
import { SITE_URL } from "@/utils/site";
import { getHoneymoonPrograms, getHoneymoonSettings } from "@/utils/honeymoon";
import HoneymoonPlanning from "@/components/user/pages/honeymoon/HoneymoonPlanning";

export const metadata: Metadata = {
  title: "Planiranje medenog mjeseca | putujEM s travEM",
  description: "Prepustite nam planiranje medenog mjeseca po vašoj mjeri. Odaberite program za inspiraciju ili nam pošaljite slobodan upit.",
  keywords: "planiranje medenog mjeseca, planiranje medenog mjeseca, medeni mjesec, putujEM s travEM",
  alternates: { canonical: `${SITE_URL}/medeni-mjesec` },
  openGraph: { title: "Planiranje medenog mjeseca | putujEM s travEM", description: "Medenog mjesec skrojen prema vašim željama.", url: `${SITE_URL}/medeni-mjesec`, type: "website" },
};

export default async function Page() {
  const [programs, settings] = await Promise.all([
    getHoneymoonPrograms().catch(() => []),
    getHoneymoonSettings().catch(() => ({ id: 1, hero_image_url: null })),
  ]);
  return <HoneymoonPlanning initialPrograms={programs} heroImageUrl={settings.hero_image_url || "/images/world-map.jpg"} />;
}
