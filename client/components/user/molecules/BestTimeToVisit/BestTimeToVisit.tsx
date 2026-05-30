// client/components/user/molecules/BestTimeToVisit/BestTimeToVisit.tsx
"use client";

import { CSSProperties, KeyboardEvent, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/utils/api";
import { getCountryAccusative } from "@/utils/countryGrammar";
import {
  ICON,
  MONTH_LABEL,
  MonthKey,
  computeBestTimeMonths,
  normalizeSlug,
  ratingClass,
  splitNote,
} from "@/utils/bestTimeToVisit";
import "./BestTimeToVisit.scss";

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

type Props = {
  countrySlug: string;
  countryId?: number;
};

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

    return computeBestTimeMonths(region.months);
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
