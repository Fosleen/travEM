import type { Metadata } from "next";
import Image from "next/image";
import DestinationsExplorer from "@/components/user/pages/contentHubs/DestinationsExplorer";
import "@/components/user/pages/contentHubs/ContentHubs.scss";
import { getContinents } from "@/utils/continents";
import { getCountriesByContinent } from "@/utils/countries";
import { getHomepage } from "@/utils/homepage";
import { SITE_URL } from "@/utils/site";

export const metadata: Metadata = {
  title: "Destinacije - putujEM s travEM",
  description:
    "Istražite sve države koje smo posjetili, pregledane po kontinentima, uz vodiče i iskustva iz prve ruke.",
  alternates: { canonical: `${SITE_URL}/destinacije` },
  openGraph: {
    title: "Destinacije - putujEM s travEM",
    description:
      "Istražite sve naše destinacije, države i vodiče za putovanja po kontinentima.",
    type: "website",
    url: `${SITE_URL}/destinacije`,
  },
};

export default async function DestinationsPage() {
  const [continentsResponse, homepageContent] = await Promise.all([
    getContinents(),
    getHomepage(),
  ]);
  const continents = Array.isArray(continentsResponse)
    ? continentsResponse
    : [];
  const heroImage = homepageContent?.banner_image_url || "/images/world-map.jpg";
  const groups = await Promise.all(
    continents.map(async (continent) => {
      const response = await getCountriesByContinent(continent.id);
      const countries = Array.isArray(response)
        ? [...response].sort((a, b) =>
            a.name.localeCompare(b.name, "hr", { sensitivity: "base" })
          )
        : [];
      return { continent, countries };
    })
  );

  return (
    <div className="content-hub">
      <header className="content-hub__intro content-hub__intro--destinations">
        <Image
          src={heroImage}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          unoptimized
          priority
        />
        <div className="content-hub__intro-content">
          <span className="content-hub__eyebrow">Putovanja iz prve ruke</span>
          <h1>Destinacije</h1>
          <p>
            Odaberite kontinent i istražite države koje smo zaista posjetili.
            Čekaju vas praktični savjeti, iskustva i detaljni vodiči.
          </p>
        </div>
      </header>

      <DestinationsExplorer
        groups={groups.filter(({ countries }) => countries.length > 0)}
      />
    </div>
  );
}
