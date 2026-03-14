/*
// @ts-nocheck
"use client";

import HorizontalPostItemBig from "../../atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import RecommendedPosts from "../../molecules/RecommendedPosts";
import "./AirplaneTickets.scss";

type Article = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  main_image_url: string;
  airport_city: {
    id: number;
    name: string;
  };
};

type AirplaneTicketsProps = {
  initialTickets: Article[];
  cityName: string;
  recommendedId: number | null;
};

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

const AirplaneTickets = ({
  initialTickets,
  cityName,
  recommendedId,
}: AirplaneTicketsProps) => {
  // Format city name: capitalize each word
  const formattedCityName = cityName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  // Pick custom airport title if exists, otherwise fallback
  const airportTitle =
    AIRPORT_NAMES[formattedCityName] ?? `Zračna luka ${formattedCityName}`;

  return (
    <div className="airplane-tickets-parent-wrapper">
      <div className="airplane-tickets-text-wrapper">
        <h1>{airportTitle}</h1>
      </div>

      <div className="airplane-tickets-grid-wrapper">
        {initialTickets.length > 0 ? (
          initialTickets.map((article) => (
            <HorizontalPostItemBig key={article.id} data={article} />
          ))
        ) : (
          <div className="no-tickets-message">
            <h2>Trenutno nema aviokarti za ovo mjesto</h2>
          </div>
        )}
      </div>

      {recommendedId && <RecommendedPosts type="article" id={recommendedId} />}
    </div>
  );
};

export default AirplaneTickets;
*/

// @ts-nocheck

// @ts-nocheck
"use client";

import { useMemo } from "react";
import RecommendedPosts from "../../molecules/RecommendedPosts";

import AirplaneTicketsHero from "../../atoms/AirplaneTicketsHero/AirplaneTicketsHero";
import AirplaneTicketsPromoCard from "../../atoms/AirplaneTicketsPromoCard/AirplaneTicketsPromoCard";
import AirplaneTicketsCarouselRow from "../../atoms/AirplaneTicketsCarouselRow/AirplaneTicketsCarouselRow";

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
  airport_city: {
    id: number;
    name: string;
  };

  // Optional (front-only)
  farFarAway?: boolean;
};

type AirplaneTicketsProps = {
  initialTickets: Article[];
  cityName: string;
  recommendedId: number | null;
};

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

// “iz Zagreba / iz Zadra / ...”
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

// HERO image per city (hardkodirano)
const HERO_IMAGES: Record<string, string> = {
  Zagreb:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Zagreb%20Airport.jpg",
  Split:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Split%20Airport.jpg",
  Dubrovnik:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Dubrovnik%20Airport.jpg",
  Zadar:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Zadar%20Airport.jpg",
  Pula:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Pula%20Airport.jpg",
  Rijeka:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Rijeka%20Airport.jpg",
  Osijek:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Osijek%20Airport.jpg",

  Beograd:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Beograd%20Airport.jpg",
  Sarajevo:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Sarajevo%20Airport.jpg",
  Trst:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Trst%20Airport.jpg",
  Beč:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Bec%20Airport.jpg",
  Budimpešta:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Budapest%20Airport.jpg",
  Venecija:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Venecija%20Airport.jpg",
  Tuzla:
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Tuzla%20Airport.jpg",
  "Banja Luka":
    "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Banja%20Luka%20Airport.jpg",
};

// Fallback da se ne desi da Image dobije prazan string
const DEFAULT_HERO_IMAGE =
  HERO_IMAGES["Zagreb"] ||
  "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Zagreb%20Airport.jpg";

// Front-only filtriranje bez backenda (max 5 prikaz)
const FAR_AWAY_TICKET_IDS_BY_CITY: Record<string, number[]> = {
  Zagreb: [544, 439],
  Split: [556],
  Dubrovnik: [],
  Zadar: [],
  Pula: [],
  Rijeka: [],
  Osijek: [],
  Beograd: [],
  Sarajevo: [],
  Trst: [523],
  Beč: [565],
  Budimpešta: [],
  Venecija: [],
  Tuzla: [524],
  "Banja Luka": [],
};

const AirplaneTickets = ({
  initialTickets,
  cityName,
  recommendedId,
}: AirplaneTicketsProps) => {
  // Format city name: capitalize each word
  const formattedCityName = cityName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  // Naslov aerodroma
  const airportTitle =
    AIRPORT_NAMES[formattedCityName] ?? `Zračna luka ${formattedCityName}`;

  // Subtitle s padežom (fallback: iz {City})
  const cityGenitive = CITY_GENITIVE[formattedCityName];
  const heroSubtitle = cityGenitive
    ? `Najnovije ponude i povoljni letovi iz ${cityGenitive}.`
    : `Najnovije ponude i povoljni letovi iz ${formattedCityName}.`;

  // Hero slika po gradu (fallback: Zagreb)
  const heroImageUrl = HERO_IMAGES[formattedCityName] ?? DEFAULT_HERO_IMAGE;

  // Front-only split u 2 sekcije: Bliske / Daleke
  const { closeTickets, farTickets } = useMemo(() => {
    const farIds = new Set<number>(
      FAR_AWAY_TICKET_IDS_BY_CITY[formattedCityName] ?? []
    );

    const enriched = (initialTickets ?? []).map((t) => ({
      ...t,
      farFarAway: farIds.has(t.id),
    }));

    const close = enriched.filter((t) => !t.farFarAway).slice(0, 6);
    const far = enriched.filter((t) => t.farFarAway).slice(0, 6);

    return { closeTickets: close, farTickets: far };
  }, [initialTickets, formattedCityName]);

  return (
    <div className="airplane-tickets-parent-wrapper">
      {/* HERO (slika + naslov + podnaslov u overlayu na VRHU) */}
      <AirplaneTicketsHero
        imageUrl={heroImageUrl}
        title={airportTitle}
        subtitle={heroSubtitle}
      />

      {/* PROMO (statika ispod hero, zatamnjena slika + CTA button) */}
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

      {/* SEKCIJE: Bliske / Daleke */}
      <div className="airplane-tickets-sections-wrapper">
        <AirplaneTicketsCarouselRow
          title="Bliske destinacije"
          items={closeTickets}
        />

        <AirplaneTicketsCarouselRow
          title="Daleke destinacije"
          items={farTickets}
        />
      </div>

      {/* Povezani članci ostaju kao prije */}
      {recommendedId && <RecommendedPosts type="article" id={recommendedId} />}
    </div>
  );
};

export default AirplaneTickets;


