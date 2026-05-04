// client/components/user/molecules/BestTimeToVisitPlace/BestTimeToVisitPlace.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/utils/api";
import "./BestTimeToVisitPlace.scss";

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

type ApiBestTimeMonth = {
  id: number;
  place_best_time_to_visit_id: number;
  month_key: MonthKey;
  avg_temp_c: string | number;
  avg_rain_mm: string | number;
};

type ApiBestTimePlace = {
  id: number;
  place_id: number;
  slug: string;
  subtitle?: string | null;
  note?: string | null;
  is_enabled: boolean;
  months: ApiBestTimeMonth[];
  place?: {
    id: number;
    name: string;
    name_genitive?: string | null;
    name_dative?: string | null;
    name_accusative?: string | null;
    name_locative?: string | null;
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
  placeSlug: string;
  placeNameDative?: string;
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

export default function BestTimeToVisitPlace({
  placeSlug,
  placeNameDative,
}: Props) {
  const normalizedSlug = normalizeSlug(placeSlug);

  const [placeClimate, setPlaceClimate] = useState<ApiBestTimePlace | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBestTimeData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${apiUrl}/place-best-time-to-visit/${normalizedSlug}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          if (isMounted) {
            setPlaceClimate(null);
          }

          return;
        }

        const data = await response.json();

        if (isMounted) {
          setPlaceClimate(data);
        }
      } catch (error) {
        console.warn("Failed to fetch best time to visit data:", error);

        if (isMounted) {
          setPlaceClimate(null);
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
  }, [normalizedSlug]);

  const computed = useMemo(() => {
    if (!placeClimate?.months || placeClimate.months.length === 0) return null;

    const normalizedMonths = [...placeClimate.months]
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
  }, [placeClimate]);

  if (isLoading) return null;
  if (!placeClimate || !computed) return null;

  const titlePlaceName =
    placeClimate.place?.name_dative ||
    placeNameDative ||
    placeClimate.place?.name ||
    placeSlug;

  return (
    <section className="btv-place">
      <div className="btv-place-header">
        <div className="btv-place-title">
          <h2>Najbolje vrijeme za posjet {titlePlaceName}</h2>

          {placeClimate.subtitle && (
            <p className="btv-place-subtitle">{placeClimate.subtitle}</p>
          )}
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

      {placeClimate.note && (
        <div className="btv-place-note">{placeClimate.note}</div>
      )}

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
              <div
                className="btv-place-bar"
                style={{ height: `${m.heightPct}%` }}
              />
            </div>

            <div className="btv-place-month-label">{MONTH_LABEL[m.month]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}