// client/components/user/molecules/BestTimeToVisitPlace/BestTimeToVisitPlace.tsx
"use client";

import { useMemo } from "react";
import "./BestTimeToVisitPlace.scss";
import {
  BEST_TIME_PLACES_DATA,
  MonthKey,
  PlaceClimate,
  WeatherIconKey,
} from "@/utils/bestTimeToVisitPlacesData";

const MONTH_LABEL: Record<MonthKey, string> = {
  jan: "Sij",
  feb: "Velj",
  mar: "Ožu",
  apr: "Tra",
  may: "Svi",
  jun: "Lip",
  jul: "Srp",
  aug: "Kol",
  sep: "Ruj",
  oct: "Lis",
  nov: "Stu",
  dec: "Pro",
};

const ICON: Record<WeatherIconKey, string> = {
  sunny: "☀️",
  partly_cloudy: "⛅",
  cloudy: "☁️",
  rain: "🌧️",
  showers: "🌦️",
  snow: "❄️",
  wind: "💨",
  fog: "🌫️",
};

type Props = {
  placeSlug: string; // iz URL-a
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function tempComfortScore(tempC: number) {
  const idealMin = 18;
  const idealMax = 26;
  const okMin = 12;
  const okMax = 30;

  if (tempC >= idealMin && tempC <= idealMax) return 1;

  if (tempC >= okMin && tempC < idealMin) {
    return (tempC - okMin) / (idealMin - okMin);
  }

  if (tempC > idealMax && tempC <= okMax) {
    return 1 - (tempC - idealMax) / (okMax - idealMax);
  }

  return 0;
}

function rainDryScore(rainMm: number, minRain: number, maxRain: number) {
  const span = Math.max(1, maxRain - minRain);
  const norm = (rainMm - minRain) / span;
  return 1 - clamp(norm, 0, 1);
}

function monthScore(tempC: number, rainMm: number, minRain: number, maxRain: number) {
  const t = tempComfortScore(tempC);
  const r = rainDryScore(rainMm, minRain, maxRain);
  const score01 = 0.65 * t + 0.35 * r;
  return Math.round(score01 * 100);
}

function assignRatingsByRank(monthKeysSortedBestToWorst: MonthKey[]) {
  const ratingByMonth = new Map<MonthKey, "Najbolje" | "Dobro" | "U redu" | "Loše">();
  const n = monthKeysSortedBestToWorst.length;

  for (let i = 0; i < n; i++) {
    const month = monthKeysSortedBestToWorst[i];
    if (i <= 1) ratingByMonth.set(month, "Najbolje");
    else if (i <= 5) ratingByMonth.set(month, "Dobro");
    else if (i <= 9) ratingByMonth.set(month, "U redu");
    else ratingByMonth.set(month, "Loše");
  }

  return ratingByMonth;
}

function computeIcon(tempC: number, rainMm: number, minRain: number, maxRain: number): WeatherIconKey {
  if (tempC <= 1) return "snow";

  const span = Math.max(1, maxRain - minRain);
  const rainNorm = clamp((rainMm - minRain) / span, 0, 1);

  if (rainNorm >= 0.85) return "rain";
  if (rainNorm >= 0.65) return "showers";
  if (rainNorm >= 0.45) return "cloudy";
  if (rainNorm >= 0.25) return "partly_cloudy";

  return "sunny";
}

function ratingClass(r: string) {
  if (r === "Najbolje") return "best";
  if (r === "Dobro") return "good";
  if (r === "U redu") return "variable";
  return "poor";
}

export default function BestTimeToVisitPlace({ placeSlug }: Props) {
  const normalizedSlug = decodeURIComponent(placeSlug).toLowerCase();

  const place: PlaceClimate | undefined = useMemo(() => {
    return BEST_TIME_PLACES_DATA.find((p) => p.slug.toLowerCase() === normalizedSlug);
  }, [normalizedSlug]);

  const computed = useMemo(() => {
    if (!place) return null;

    const temps = place.months.map((m) => m.tempC);
    const maxT = Math.max(...temps);
    const minT = Math.min(...temps);
    const range = Math.max(10, maxT - minT);

    const rains = place.months.map((m) => m.rainMm);
    const minRain = Math.min(...rains);
    const maxRain = Math.max(...rains);

    const scored = place.months.map((m) => ({
      month: m.month,
      score: monthScore(m.tempC, m.rainMm, minRain, maxRain),
    }));

    const sorted = [...scored].sort((a, b) => b.score - a.score);
    const monthOrder = sorted.map((s) => s.month);
    const ratingByMonth = assignRatingsByRank(monthOrder);

    const months = place.months.map((m) => {
      const rating = ratingByMonth.get(m.month) ?? "U redu";
      const icon = m.icon ?? computeIcon(m.tempC, m.rainMm, minRain, maxRain);

      const h = ((m.tempC - minT) / range) * 100;
      const heightPct = clamp(h, 12, 100);

      return { ...m, rating, icon, heightPct };
    });

    return { months, minT, maxT };
  }, [place]);

  if (!place || !computed) return null;

  return (
    <section className="btv-place">
      <div className="btv-place-header">
        <div className="btv-place-title">
          <h2>{place.title ?? `Najbolje vrijeme za posjet ${placeSlug}`}</h2>
          {place.subtitle && <p className="btv-place-subtitle">{place.subtitle}</p>}
        </div>

        <div className="btv-place-legend">
          <div className="btv-place-legend-item">
            <span className="dot best" /> Najbolje
          </div>
          <div className="btv-place-legend-item">
            <span className="dot good" /> Dobro
          </div>
          <div className="btv-place-legend-item">
            <span className="dot variable" /> U redu
          </div>
          <div className="btv-place-legend-item">
            <span className="dot poor" /> Loše
          </div>
        </div>
      </div>

      {place.note && <div className="btv-place-note">{place.note}</div>}

      <div className="btv-place-grid" role="list">
        {computed.months.map((m) => (
          <div
            key={m.month}
            className={`btv-place-month ${ratingClass(m.rating)}`}
            role="listitem"
          >
            <div className="btv-place-month-icon" aria-hidden="true">
              {ICON[m.icon]}
            </div>

            <div className="btv-place-month-temp">{m.tempC}°C</div>

            <div className="btv-place-bar-wrap">
              <div className="btv-place-bar" style={{ height: `${m.heightPct}%` }} />
            </div>

            <div className="btv-place-month-label">{MONTH_LABEL[m.month]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
