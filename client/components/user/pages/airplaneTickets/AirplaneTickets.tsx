// @ts-nocheck
"use client";

import { Fragment, useMemo } from "react";
import RecommendedPosts from "../../molecules/RecommendedPosts";

import AirplaneTicketsHero from "../../atoms/AirplaneTicketsHero/AirplaneTicketsHero";
import AirplaneTicketsPromoCard from "../../atoms/AirplaneTicketsPromoCard/AirplaneTicketsPromoCard";
import AirplaneTicketsCarouselRow from "../../atoms/AirplaneTicketsCarouselRow/AirplaneTicketsCarouselRow";
import AirplaneTicketsNewsletterCallToAction from "../../molecules/AirplaneTicketsNewsletterCallToAction/AirplaneTicketsNewsletterCallToAction";
import { getArticleUrl } from "@/utils/articleUrl";
import { getAirportHeroImage } from "@/utils/airportVisuals";

const PROMO_IMAGE_URL =
  "https://live.staticflickr.com/65535/54231796537_ee931fd0bb_b.jpg";

import "./AirplaneTickets.scss";

type Article = {
  id: number;
  slug?: string;
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
  promo?: {
    top_text?: string;
    middle_text?: string;
    button_text?: string;
    featured_article?: {
      id?: number;
      slug?: string;
      main_image_url?: string;
    } | null;
  } | null;
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
  promo,
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

  const heroImageUrl = getAirportHeroImage(formattedCityName);

  const { closeTickets, farTickets } = useMemo(() => {
    const tickets = (initialTickets ?? []).filter(isAirplaneTicketArticle);

    const close = tickets
      .filter((ticket) => !isFarDestination(ticket))
      .slice(0, 6);

    const far = tickets.filter((ticket) => isFarDestination(ticket)).slice(0, 6);

    return { closeTickets: close, farTickets: far };
  }, [initialTickets]);

  const promoTitleText =
    promo?.top_text || "Ideš na svoj prvi let?\nEvo što sve trebaš znati";
  const promoTitle = (
    <>
      {promoTitleText.split("\n").map((line, index, lines) => (
        <Fragment key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );

  const promoHref = promo?.featured_article?.id
    ? getArticleUrl(promo.featured_article)
    : "/clanak/356";

  const promoImageUrl =
    promo?.featured_article?.main_image_url || PROMO_IMAGE_URL;

  return (
    <div className="airplane-tickets-parent-wrapper">
      <AirplaneTicketsHero
        imageUrl={heroImageUrl}
        title={airportTitle}
        subtitle={heroSubtitle}
      />

      <AirplaneTicketsPromoCard
        imageUrl={promoImageUrl}
        title={promoTitle}
        imageAlt={promoTitleText}
        text={
          promo?.middle_text ||
          "Praktični vodič za sve što trebaš znati prije nego odeš na svoj prvi let, i sve što možeš očekivati tijekom putovanja."
        }
        buttonText={promo?.button_text || "Pročitaj vodič ✈︎"}
        href={promoHref}
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
