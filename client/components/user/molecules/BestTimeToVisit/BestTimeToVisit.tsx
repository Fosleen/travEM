// client/components/user/molecules/BestTimeToVisit/BestTimeToVisit.tsx
"use client";

import { CSSProperties, KeyboardEvent, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/utils/api";
import { getCountryAccusative } from "@/utils/countryGrammar";
import "./BestTimeToVisit.scss";

type MonthKey =
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "jun"
  | "jul"
  | "aug"
  | "sep"
  | "oct"
  | "nov"
  | "dec";

type WeatherIconKey =
  | "sunny"
  | "partly_cloudy"
  | "cloudy"
  | "rain"
  | "showers"
  | "snow"
  | "wind"
  | "fog";

type ApiCountryBestTimeMonth = {
  id: number;
  country_best_time_to_visit_region_id: number;
  month_key: MonthKey;
  avg_temp_c: string | number;
  avg_rain_mm: string | number;
};

type ApiCountryBestTimeRegion = {
  id: number;
  country_best_time_to_visit_id: number;
  region_key: string;
  label: string;
  note?: string | null;
  sort_order: number;
  months: ApiCountryBestTimeMonth[];
};

type ApiCountryBestTime = {
  id: number;
  country_id: number;
  slug: string;
  title?: string | null;
  subtitle?: string | null;
  is_enabled: boolean;
  regions: ApiCountryBestTimeRegion[];
  country?: {
    id: number;
    name: string;
  };
};

type ComputedMonth = {
  month: MonthKey;
  tempC: number;
  rainMm: number;
  rating: "Najbolje" | "Dobro" | "U redu" | "Loše";
  icon: WeatherIconKey;
  heightPct: number;
};

type Props = {
  countrySlug: string;
  countryId?: number;
};

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

const MONTH_ORDER: MonthKey[] = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

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

function monthScore(
  tempC: number,
  rainMm: number,
  minRain: number,
  maxRain: number
) {
  const t = tempComfortScore(tempC);
  const r = rainDryScore(rainMm, minRain, maxRain);
  const score01 = 0.65 * t + 0.35 * r;

  return Math.round(score01 * 100);
}

function assignRatingsByRank(monthKeysSortedBestToWorst: MonthKey[]) {
  const ratingByMonth = new Map<
    MonthKey,
    "Najbolje" | "Dobro" | "U redu" | "Loše"
  >();

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

function computeIcon(
  tempC: number,
  rainMm: number,
  minRain: number,
  maxRain: number
): WeatherIconKey {
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

function normalizeSlug(slug: string) {
  return decodeURIComponent(slug).toLowerCase();
}

function splitNote(note: string) {
  const trimmed = note.trim();

  if (!trimmed) {
    return {
      lead: "",
      rest: "",
    };
  }

  const firstSentenceMatch = trimmed.match(/^(.+?[.!?])\s*(.*)$/);

  if (!firstSentenceMatch) {
    return {
      lead: trimmed,
      rest: "",
    };
  }

  return {
    lead: firstSentenceMatch[1],
    rest: firstSentenceMatch[2],
  };
}

export default function BestTimeToVisit({ countrySlug, countryId }: Props) {
  const normalizedSlug = normalizeSlug(countrySlug);

  const [countryClimate, setCountryClimate] =
    useState<ApiCountryBestTime | null>(null);
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null);
  const [activeMonthKey, setActiveMonthKey] = useState<MonthKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBestTimeData = async () => {
      try {
        setIsLoading(true);

        const endpoint = countryId
          ? `${apiUrl}/country-best-time-to-visit/country/${countryId}`
          : `${apiUrl}/country-best-time-to-visit/${normalizedSlug}`;

        const response = await fetch(endpoint, {
          cache: "no-store",
        });

        if (!response.ok) {
          if (isMounted) {
            setCountryClimate(null);
            setActiveRegionId(null);
          }

          return;
        }

        const data = await response.json();

        if (isMounted) {
          setCountryClimate(data);
          setActiveRegionId(data?.regions?.[0]?.region_key || null);
        }
      } catch (error) {
        console.warn("Failed to fetch country best time to visit data:", error);

        if (isMounted) {
          setCountryClimate(null);
          setActiveRegionId(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBestTimeData();

    return () => {
      isMounted = false;
    };
  }, [countryId, normalizedSlug]);

  useEffect(() => {
    setActiveMonthKey(null);
  }, [activeRegionId]);

  const region = useMemo(() => {
    if (!countryClimate?.regions || countryClimate.regions.length === 0) {
      return null;
    }

    const sortedRegions = [...countryClimate.regions].sort(
      (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)
    );

    const fallback = sortedRegions[0];

    if (!activeRegionId) {
      return fallback;
    }

    return (
      sortedRegions.find((item) => item.region_key === activeRegionId) ||
      fallback
    );
  }, [countryClimate, activeRegionId]);

  const computed = useMemo(() => {
    if (!region?.months || region.months.length === 0) return null;

    const normalizedMonths = [...region.months]
      .sort(
        (a, b) =>
          MONTH_ORDER.indexOf(a.month_key) - MONTH_ORDER.indexOf(b.month_key)
      )
      .map((month) => ({
        month: month.month_key,
        tempC: Number(month.avg_temp_c),
        rainMm: Number(month.avg_rain_mm),
      }))
      .filter(
        (month) =>
          !Number.isNaN(month.tempC) &&
          !Number.isNaN(month.rainMm) &&
          MONTH_ORDER.includes(month.month)
      );

    if (normalizedMonths.length === 0) return null;

    const temps = normalizedMonths.map((m) => m.tempC);
    const maxT = Math.max(...temps);
    const minT = Math.min(...temps);
    const range = Math.max(10, maxT - minT);

    const rains = normalizedMonths.map((m) => m.rainMm);
    const minRain = Math.min(...rains);
    const maxRain = Math.max(...rains);

    const scored = normalizedMonths.map((m) => ({
      month: m.month,
      score: monthScore(m.tempC, m.rainMm, minRain, maxRain),
    }));

    const sorted = [...scored].sort((a, b) => b.score - a.score);
    const monthOrder = sorted.map((s) => s.month);
    const ratingByMonth = assignRatingsByRank(monthOrder);

    const months: ComputedMonth[] = normalizedMonths.map((m) => {
      const rating = ratingByMonth.get(m.month) ?? "U redu";
      const icon = computeIcon(m.tempC, m.rainMm, minRain, maxRain);

      const h = ((m.tempC - minT) / range) * 100;
      const heightPct = clamp(h, 12, 100);

      return { ...m, rating, icon, heightPct };
    });

    return { months, minT, maxT };
  }, [region]);

  if (isLoading) return null;
  if (!countryClimate || !region || !computed) return null;

  const countryName = countryClimate.country?.name || countrySlug;
  const title =
    countryClimate.title ||
    `Kada je najbolje posjetiti ${getCountryAccusative(countryName)}?`;

  const sortedRegions = [...countryClimate.regions].sort(
    (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)
  );

  const noteParts = region.note ? splitNote(region.note) : null;

  const handleMonthKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    month: MonthKey
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();

    setActiveMonthKey((current) => (current === month ? null : month));
  };

  return (
    <section className="btv">
      <div className="btv-header">
        <div className="btv-title">
          <h2>{title}</h2>

          {countryClimate.subtitle && (
            <p className="btv-subtitle">{countryClimate.subtitle}</p>
          )}
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

      {sortedRegions.length > 1 && (
        <div className="btv-tabs">
          {sortedRegions.map((item) => (
            <button
              key={item.region_key}
              type="button"
              className={`btv-tab ${
                item.region_key === region.region_key ? "active" : ""
              }`}
              onClick={() => setActiveRegionId(item.region_key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {noteParts && (
        <div className="btv-note">
          <div className="btv-note-badge" aria-hidden="true">
            <span>★</span>
          </div>

          <div className="btv-note-content">
            <p className="btv-note-lead">{noteParts.lead}</p>

            {noteParts.rest && <p className="btv-note-rest">{noteParts.rest}</p>}
          </div>
        </div>
      )}

      <div className="btv-grid" role="list">
        {computed.months.map((m) => (
          <div
            key={m.month}
            className={`btv-month ${ratingClass(m.rating)} ${
              activeMonthKey === m.month ? "is-active" : ""
            }`}
            role="listitem"
            tabIndex={0}
            onClick={() =>
              setActiveMonthKey((current) =>
                current === m.month ? null : m.month
              )
            }
            onKeyDown={(event) => handleMonthKeyDown(event, m.month)}
          >
            <div className="btv-month-label">{MONTH_LABEL[m.month]}</div>

            <div className="btv-month-icon" aria-hidden="true">
              {ICON[m.icon]}
            </div>

            <div className="btv-month-temp">{m.tempC}°C</div>

            <div className="btv-bar-wrap" aria-hidden="true">
              <div
                className="btv-bar"
                style={
                  {
                    "--btv-bar-size": `${m.heightPct}%`,
                  } as CSSProperties
                }
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}