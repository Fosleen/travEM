import type { Metadata } from "next";
import Image from "next/image";
import TipsMenuItem from "@/components/user/molecules/TipsMenuItem/TipsMenuItem";
import "@/components/user/pages/contentHubs/ContentHubs.scss";
import { getArticleTypes } from "@/utils/articleTypes";
import { SITE_URL } from "@/utils/site";
import { TIPS_CATEGORY_ICONS } from "@/utils/articleTypeHelpers";

const tipVisuals: Record<string, { title: string; icon: string }> = {
  pakiranje: { title: "Pakiranje", icon: TIPS_CATEGORY_ICONS.pakiranje },
  "let-avionom": { title: "Let avionom", icon: TIPS_CATEGORY_ICONS["let-avionom"] },
  "organizacija-puta": {
    title: "Novosti i organizacija puta",
    icon: TIPS_CATEGORY_ICONS["organizacija-puta"],
  },
  aplikacije: { title: "Aplikacije", icon: TIPS_CATEGORY_ICONS.aplikacije },
  smjestaj: { title: "Smještaj", icon: TIPS_CATEGORY_ICONS.smjestaj },
  revolut: { title: "Revolut", icon: TIPS_CATEGORY_ICONS.revolut },
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
              icon: TIPS_CATEGORY_ICONS["organizacija-puta"],
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
