// @ts-nocheck
"use client";

import { useMemo } from "react";
import RecommendedPosts from "../../molecules/RecommendedPosts";

import AirplaneTicketsHero from "../../atoms/AirplaneTicketsHero/AirplaneTicketsHero";
import AirplaneTicketsPromoCard from "../../atoms/AirplaneTicketsPromoCard/AirplaneTicketsPromoCard";
import AirplaneTicketsCarouselRow from "../../atoms/AirplaneTicketsCarouselRow/AirplaneTicketsCarouselRow";
import AirplaneTicketsNewsletterCallToAction from "../../molecules/AirplaneTicketsNewsletterCallToAction/AirplaneTicketsNewsletterCallToAction";

const PROMO_IMAGE_URL =
  "https://live.staticflickr.com/65535/54231796537_ee931fd0bb_b.jpg";

import "./AirplaneTickets.scss";

type Article = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  main_image_url: string;
  date_written?: string;
  articleTypeId?: number;
  article_type_id?: number;
  airport_city: {
    id: number;
    name: string;
  };
  isFarDestination?: boolean | number;
  is_far_destination?: boolean | number;
};

type AirplaneTicketsProps = {
  initialTickets: Article[];
  cityName: string;
  recommendedId: number | null;
};

type AirplaneTicketsSectionProps = {
  title: string;
  items: Article[];
  cityGenitive?: string;
};

const AIRPLANE_TICKETS_ARTICLE_TYPE_ID = 2;

const AIRPORT_NAMES: Record<string, string> = {
  Zagreb: "Zračna luka Franjo Tuđman Zagreb",
  Split: "Zračna luka Sveti Jeronim Split",
  Dubrovnik: "Zračna luka Ruđer Bošković Dubrovnik",
  Zadar: "Zračna luka Zadar",
  Pula: "Zračna luka Pula",
  Rijeka: "Zračna luka Rijeka",
  Osijek: "Zračna luka Osijek",

  Beograd: "Zračna luka Nikola Tesla Beograd",
  Sarajevo: "Zračna luka Sarajevo",
  Trst: "Zračna luka Trst",
  Beč: "Zračna luka Beč",
  Budimpešta: "Zračna luka Liszt Ferenc Budimpešta",
  Venecija: "Zračna luka Marco Polo Venecija",
  Tuzla: "Zračna luka Tuzla",
  "Banja Luka": "Zračna luka Banja Luka",
};

const CITY_GENITIVE: Record<string, string> = {
  Zagreb: "Zagreba",
  Split: "Splita",
  Dubrovnik: "Dubrovnika",
  Zadar: "Zadra",
  Pula: "Pule",
  Rijeka: "Rijeke",
  Osijek: "Osijeka",

  Beograd: "Beograda",
  Sarajevo: "Sarajeva",
  Trst: "Trsta",
  Beč: "Beča",
  Budimpešta: "Budimpešte",
  Venecija: "Venecije",
  Tuzla: "Tuzle",
  "Banja Luka": "Banje Luke",
};

const HERO_IMAGES: Record<string, string> = {
  Zagreb:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Zagreb%20Airport.jpg?updatedAt=1777029689876",
  Split:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Split%20Airport.jpg?updatedAt=1777029690103",
  Dubrovnik:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Dubrovnik%20Airport.jpg?updatedAt=1777029690416",
  Zadar:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Zadar%20Airport.jpg?updatedAt=1777029689938",
  Pula:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Pula%20Airport.jpg?updatedAt=1777029690253",
  Rijeka:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Rijeka%20Airport.jpg?updatedAt=1777029690715",
  Osijek:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Osijek%20Airport.jpg?updatedAt=1777029689934",

  Beograd:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Beograd%20Airport.jpg?updatedAt=1777029689995",
  Sarajevo:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Sarajevo%20Airport.jpg?updatedAt=1777029690351",
  Trst:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Trst%20Airport.jpg?updatedAt=1777029690065",
  Beč:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Bec%20Airport.jpg?updatedAt=1777029690240",
  Budimpešta:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Budapest%20Airport.jpg?updatedAt=1777029690232",
  Venecija:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Venecija%20Airport.jpg?updatedAt=1777029690022",
  Tuzla:
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Tuzla%20Airport.jpg?updatedAt=1777029690426",
  "Banja Luka":
    "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Banja%20Luka%20Airport.jpg?updatedAt=1777029689385",
};

const DEFAULT_HERO_IMAGE =
  HERO_IMAGES["Zagreb"] ||
  "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Zagreb%20Airport.jpg";

const isAirplaneTicketArticle = (ticket: Article) => {
  return (
    ticket.articleTypeId === AIRPLANE_TICKETS_ARTICLE_TYPE_ID ||
    ticket.article_type_id === AIRPLANE_TICKETS_ARTICLE_TYPE_ID
  );
};

const isFarDestination = (ticket: Article) => {
  return (
    ticket.isFarDestination === true ||
    ticket.isFarDestination === 1 ||
    ticket.is_far_destination === true ||
    ticket.is_far_destination === 1
  );
};

const AirplaneTicketsSection = ({
  title,
  items,
  cityGenitive,
}: AirplaneTicketsSectionProps) => {
  if (items.length > 0) {
    return <AirplaneTicketsCarouselRow title={title} items={items} />;
  }

  return (
    <section className="airplane-tickets-section">
      <h2 className="airplane-tickets-section-title">{title}</h2>

      <AirplaneTicketsNewsletterCallToAction cityGenitive={cityGenitive} />
    </section>
  );
};

const AirplaneTickets = ({
  initialTickets,
  cityName,
  recommendedId,
}: AirplaneTicketsProps) => {
  const formattedCityName = cityName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const airportTitle =
    AIRPORT_NAMES[formattedCityName] ?? `Zračna luka ${formattedCityName}`;

  const cityGenitive = CITY_GENITIVE[formattedCityName];

  const heroSubtitle = cityGenitive
    ? `Najnovije ponude i povoljni letovi iz ${cityGenitive}.`
    : `Najnovije ponude i povoljni letovi iz ${formattedCityName}.`;

  const heroImageUrl = HERO_IMAGES[formattedCityName] ?? DEFAULT_HERO_IMAGE;

  const { closeTickets, farTickets } = useMemo(() => {
    const tickets = (initialTickets ?? []).filter(isAirplaneTicketArticle);

    const close = tickets
      .filter((ticket) => !isFarDestination(ticket))
      .slice(0, 6);

    const far = tickets.filter((ticket) => isFarDestination(ticket)).slice(0, 6);

    return { closeTickets: close, farTickets: far };
  }, [initialTickets]);

  return (
    <div className="airplane-tickets-parent-wrapper">
      <AirplaneTicketsHero
        imageUrl={heroImageUrl}
        title={airportTitle}
        subtitle={heroSubtitle}
      />

      <AirplaneTicketsPromoCard
        imageUrl={PROMO_IMAGE_URL}
        title={
          <>
            Ideš na svoj prvi let?
            <br />
            Evo što sve trebaš znati
          </>
        }
        text="Praktični vodič za sve što trebaš znati prije nego odeš na svoj prvi let, i sve što možeš očekivati tijekom putovanja."
        buttonText="Pročitaj vodič ✈︎"
        href="/clanak/356"
      />

      <div className="airplane-tickets-sections-wrapper">
        <AirplaneTicketsSection
          title="Bliske destinacije"
          items={closeTickets}
          cityGenitive={cityGenitive}
        />

        <AirplaneTicketsSection
          title="Daleke destinacije"
          items={farTickets}
          cityGenitive={cityGenitive}
        />
      </div>

      {recommendedId && <RecommendedPosts type="article" id={recommendedId} />}
    </div>
  );
};

export default AirplaneTickets;