import type { Metadata } from "next";
import Image from "next/image";
import HorizontalPostItemBig from "@/components/user/atoms/HorizontalPostItemBig";
import "@/components/user/pages/contentHubs/ContentHubs.scss";
import { getAirportCities } from "@/utils/airportCities";
import { getAirportHeroImage } from "@/utils/airportVisuals";
import { SITE_URL } from "@/utils/site";
import { toUrlSlug } from "@/utils/url";

export const metadata: Metadata = {
  title: "Aviokarte i polazni aerodromi - putujEM s travEM",
  description:
    "Pregledajte ponude aviokarata i vodiče za polaske iz hrvatskih i okolnih zračnih luka.",
  alternates: { canonical: `${SITE_URL}/aviokarte` },
  openGraph: {
    title: "Aviokarte i polazni aerodromi - putujEM s travEM",
    description: "Odaberite polazni aerodrom i pronađite ideje za putovanje.",
    type: "website",
    url: `${SITE_URL}/aviokarte`,
  },
};

export default async function AirplaneTicketsPage() {
  const response = await getAirportCities();
  const airports = Array.isArray(response)
    ? [...response].sort((a, b) =>
        a.name.localeCompare(b.name, "hr", { sensitivity: "base" })
      )
    : [];
  const groups = [
    {
      title: "Iz Hrvatske",
      airports: airports.filter((airport) => airport.is_in_croatia === true),
    },
    {
      title: "Ostali",
      airports: airports.filter((airport) => airport.is_in_croatia !== true),
    },
  ];
  const getUniqueFlags = (groupAirports: typeof airports) =>
    Array.from(
      new Map(
        groupAirports
          .filter((airport) => airport.flag_url)
          .map((airport) => [String(airport.flag_url).trim(), airport])
      ).values()
    );

  return (
    <div className="content-hub">
      <header className="content-hub__intro content-hub__intro--airports">
        <Image
          src={getAirportHeroImage("Zagreb")}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          unoptimized
          priority
        />
        <div className="content-hub__intro-content">
          <span className="content-hub__eyebrow">Vrijeme je za polijetanje</span>
          <h1>Aviokarte</h1>
          <p>
            Odaberite polazni aerodrom i pregledajte aktualne ideje, rute i
            savjete za povoljnije putovanje avionom.
          </p>
        </div>
      </header>

      {groups.map((group) => (
        <section
          className="content-hub__section content-hub__airport-section"
          key={group.title}
        >
          <div className="content-hub__airport-flag-wash" aria-hidden="true">
            {getUniqueFlags(group.airports).map((airport) => (
              <Image
                key={`wash-${String(airport.flag_url).trim()}`}
                src={String(airport.flag_url).trim()}
                alt=""
                width={240}
                height={180}
                unoptimized
              />
            ))}
          </div>
          <div className="content-hub__airport-heading">
            <h2>{group.title}</h2>
            <div
              className="content-hub__airport-flags"
              aria-label={`Zastave za grupu ${group.title}`}
            >
              {getUniqueFlags(group.airports).map((airport) => (
                <Image
                  key={airport.flag_url}
                  src={String(airport.flag_url).trim()}
                  alt={`Zastava uz aerodrom ${airport.name}`}
                  title={airport.name}
                  width={36}
                  height={36}
                  unoptimized
                />
              ))}
            </div>
          </div>
          <div className="content-hub__grid content-hub__airport-grid">
            {group.airports.map((airport) => (
              <HorizontalPostItemBig
                key={airport.id}
                hasDate={false}
                type="airport"
                variant="airport"
                href={`/aviokarte/${toUrlSlug(airport.name)}`}
                data={{
                  id: airport.id,
                  name: airport.name,
                  main_image_url: getAirportHeroImage(airport.name),
                  flag_image_url: airport.flag_url,
                }}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
