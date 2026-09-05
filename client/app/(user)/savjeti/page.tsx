import type { Metadata } from "next";
import Image from "next/image";
import TipsMenuItem from "@/components/user/molecules/TipsMenuItem/TipsMenuItem";
import "@/components/user/pages/contentHubs/ContentHubs.scss";
import { getArticleTypes } from "@/utils/articleTypes";
import { SITE_URL } from "@/utils/site";

const tipVisuals: Record<string, { title: string; icon: string }> = {
  pakiranje: { title: "Pakiranje", icon: "/images/luggage-icon.png" },
  "let-avionom": { title: "Let avionom", icon: "/images/airport-icon.png" },
  "organizacija-puta": {
    title: "Novosti i organizacija puta",
    icon: "/images/travel-org-icon.png",
  },
  aplikacije: { title: "Aplikacije", icon: "/images/travel-app-icon.png" },
  smjestaj: { title: "Smještaj", icon: "/images/bed-icon.png" },
  revolut: { title: "Revolut", icon: "/images/cards-icon.png" },
};

const tipOrder = [
  "pakiranje",
  "let-avionom",
  "organizacija-puta",
  "aplikacije",
  "smjestaj",
  "revolut",
];

export const metadata: Metadata = {
  title: "Savjeti za putovanja - putujEM s travEM",
  description:
    "Praktični savjeti za pakiranje, let avionom, organizaciju puta, smještaj, aplikacije i plaćanje na putovanju.",
  alternates: { canonical: `${SITE_URL}/savjeti` },
  openGraph: {
    title: "Savjeti za putovanja - putujEM s travEM",
    description: "Sve naše kategorije praktičnih savjeta za lakše putovanje.",
    type: "website",
    url: `${SITE_URL}/savjeti`,
  },
};

export default async function TipsPage() {
  const response = await getArticleTypes();
  const articleTypes = Array.isArray(response)
    ? response
        .filter((type) => Boolean(tipVisuals[type.name]))
        .sort(
          (a, b) => tipOrder.indexOf(a.name) - tipOrder.indexOf(b.name)
        )
    : [];

  return (
    <div className="content-hub">
      <header className="content-hub__intro content-hub__intro--tips">
        <Image
          src="/images/TipsAndTricks/Organizacija_puta.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="content-hub__intro-content">
          <span className="content-hub__eyebrow">Pametnije na put</span>
          <h1>Savjeti za putovanja</h1>
          <p>
            Na jednom mjestu pronađite provjerene savjete za pripremu i
            organizaciju putovanja, od pakiranja do povratka kući.
          </p>
        </div>
      </header>

      <section className="content-hub__section">
        <h2>Odaberite kategoriju</h2>
        <div className="content-hub__tips-grid">
          {articleTypes.map((type) => {
            const visual = tipVisuals[type.name] || {
              title: type.name,
              icon: "/images/travel-org-icon.png",
            };
            return (
              <TipsMenuItem
                key={type.id}
                title={visual.title}
                slugTitle={type.name}
                icon={visual.icon}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
