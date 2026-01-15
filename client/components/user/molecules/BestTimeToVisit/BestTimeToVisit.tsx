// client/components/user/molecules/BestTimeToVisit/BestTimeToVisit.tsx
"use client";

import { useMemo, useState } from "react";
import "./BestTimeToVisit.scss";
import {
  BEST_TIME_DATA,
  CountryClimate,
  MonthKey,
  RegionClimate,
  WeatherIconKey,
} from "@/utils/bestTimeToVisitData";

// Mjeseci (label na dnu stupca)
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

// Ikonice vremena
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
  countrySlug: string; // npr. "hrvatska" iz URL-a
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * TEMP SCORE (0..1)
 * Idealan raspon: 18–26°C (1.0)
 * Ok raspon: 12–30°C (linear drop)
 * Izvan toga brzo pada prema 0.
 */
function tempComfortScore(tempC: number) {
  const idealMin = 18;
  const idealMax = 26;
  const okMin = 12;
  const okMax = 30;

  if (tempC >= idealMin && tempC <= idealMax) return 1;

  if (tempC >= okMin && tempC < idealMin) {
    // 12 -> 0, 18 -> 1
    return (tempC - okMin) / (idealMin - okMin);
  }

  if (tempC > idealMax && tempC <= okMax) {
    // 26 -> 1, 30 -> 0
    return 1 - (tempC - idealMax) / (okMax - idealMax);
  }

  // izvan ok raspona
  return 0;
}

/**
 * RAIN SCORE (0..1)
 * Relativno po regiji: min kiše = 1, max kiše = 0.
 * (Bolje nego fiksni pragovi jer razne klime imaju različite “normalne” količine kiše.)
 */
function rainDryScore(rainMm: number, minRain: number, maxRain: number) {
  const span = Math.max(1, maxRain - minRain);
  const norm = (rainMm - minRain) / span; // 0..1
  return 1 - clamp(norm, 0, 1);
}

/**
 * FINAL SCORE 0..100
 * Temp je bitnija (npr. 65%), kiša malo manje (35%).
 * Ovo možeš kasnije tweakati po želji.
 */
function monthScore(tempC: number, rainMm: number, minRain: number, maxRain: number) {
  const t = tempComfortScore(tempC);
  const r = rainDryScore(rainMm, minRain, maxRain);
  const score01 = 0.65 * t + 0.35 * r;
  return Math.round(score01 * 100);
}

/**
 * Dodjela ocjena po RANK-u (uvijek bude 2 Najbolje i 2 Loše).
 * Split koji želiš:
 * - 2 Najbolje
 * - 4 Dobro
 * - 4 U redu
 * - 2 Loše
 */
function assignRatingsByRank(monthKeysSortedBestToWorst: MonthKey[]) {
  const ratingByMonth = new Map<MonthKey, "Najbolje" | "Dobro" | "U redu" | "Loše">();

  // zaštita: ako iz nekog razloga nema 12 mjeseci, radi koliko može
  const n = monthKeysSortedBestToWorst.length;

  // Top 2
  for (let i = 0; i < n; i++) {
    const month = monthKeysSortedBestToWorst[i];

    if (i <= 1) ratingByMonth.set(month, "Najbolje");
    else if (i <= 5) ratingByMonth.set(month, "Dobro"); // 2..5 = 4 mjeseca
    else if (i <= 9) ratingByMonth.set(month, "U redu"); // 6..9 = 4 mjeseca
    else ratingByMonth.set(month, "Loše"); // 10.. = bottom 2
  }

  return ratingByMonth;
}

/**
 * Ikona = heuristika iz temp + RELATIVNE kiše.
 * (Ocjena i ikona su odvojene stvari – ikona opisuje “kakav je mjesec”, ocjena je “koliko je dobar za posjet”.)
 */
function computeIcon(tempC: number, rainMm: number, minRain: number, maxRain: number): WeatherIconKey {
  if (tempC <= 1) return "snow";

  const span = Math.max(1, maxRain - minRain);
  const rainNorm = clamp((rainMm - minRain) / span, 0, 1); // 0..1

  if (rainNorm >= 0.85) return "rain";
  if (rainNorm >= 0.65) return "showers";
  if (rainNorm >= 0.45) return "cloudy";
  if (rainNorm >= 0.25) return "partly_cloudy";

  // vrlo suho
  return "sunny";
}

function ratingClass(r: string) {
  if (r === "Najbolje") return "best";
  if (r === "Dobro") return "good";
  if (r === "U redu") return "variable";
  return "poor";
}

export default function BestTimeToVisit({ countrySlug }: Props) {
  const normalizedSlug = decodeURIComponent(countrySlug).toLowerCase();

  const country: CountryClimate | undefined = useMemo(() => {
    return BEST_TIME_DATA.find((c) => c.slug.toLowerCase() === normalizedSlug);
  }, [normalizedSlug]);

  const [activeRegionId, setActiveRegionId] = useState<string | null>(
    country?.regions?.[0]?.id ?? null
  );

  const region: RegionClimate | undefined = useMemo(() => {
    if (!country) return undefined;
    const fallback = country.regions?.[0];
    if (!activeRegionId) return fallback;
    return country.regions.find((r) => r.id === activeRegionId) ?? fallback;
  }, [country, activeRegionId]);

  const computed = useMemo(() => {
    if (!region) return null;

    // --- bar height (temp) ---
    const temps = region.months.map((m) => m.tempC);
    const maxT = Math.max(...temps);
    const minT = Math.min(...temps);
    const range = Math.max(10, maxT - minT);

    // --- rain stats (relative) ---
    const rains = region.months.map((m) => m.rainMm);
    const minRain = Math.min(...rains);
    const maxRain = Math.max(...rains);

    // --- score + ranking ---
    const scored = region.months.map((m) => ({
      month: m.month,
      score: monthScore(m.tempC, m.rainMm, minRain, maxRain),
    }));

    // best -> worst
    const sorted = [...scored].sort((a, b) => b.score - a.score);
    const monthOrder = sorted.map((s) => s.month);
    const ratingByMonth = assignRatingsByRank(monthOrder);

    const months = region.months.map((m) => {
      const rating = ratingByMonth.get(m.month) ?? "U redu";
      const icon = m.icon ?? computeIcon(m.tempC, m.rainMm, minRain, maxRain);

      const h = ((m.tempC - minT) / range) * 100;
      const heightPct = clamp(h, 12, 100);

      return {
        ...m,
        rating,
        icon,
        heightPct,
      };
    });

    return { months, minT, maxT };
  }, [region]);

  if (!country || !region || !computed) return null;

  return (
    <section className="btv">
      <div className="btv-header">
        <div className="btv-title">
          <h2>{country.title ?? `Najbolje vrijeme za posjet ${countrySlug}`}</h2>
          {country.subtitle && <p className="btv-subtitle">{country.subtitle}</p>}
        </div>

        <div className="btv-legend">
          <div className="btv-legend-item">
            <span className="dot best" /> Najbolje
          </div>
          <div className="btv-legend-item">
            <span className="dot good" /> Dobro
          </div>
          <div className="btv-legend-item">
            <span className="dot variable" /> U redu
          </div>
          <div className="btv-legend-item">
            <span className="dot poor" /> Loše
          </div>
        </div>
      </div>

      {/* REGIJE (tabovi) */}
      {country.regions.length > 1 && (
        <div className="btv-tabs">
          {country.regions.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`btv-tab ${r.id === region.id ? "active" : ""}`}
              onClick={() => setActiveRegionId(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      {region.note && <div className="btv-note">{region.note}</div>}

      {/* GRID 12 mjeseci L->R */}
      <div className="btv-grid" role="list">
        {computed.months.map((m) => (
          <div
            key={m.month}
            className={`btv-month ${ratingClass(m.rating)}`}
            role="listitem"
          >
            <div className="btv-month-icon" aria-hidden="true">
              {ICON[m.icon]}
            </div>

            <div className="btv-month-temp">{m.tempC}°C</div>

            {/* stupić = temperatura */}
            <div className="btv-bar-wrap">
              <div className="btv-bar" style={{ height: `${m.heightPct}%` }} />
            </div>

            <div className="btv-month-label">{MONTH_LABEL[m.month]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
