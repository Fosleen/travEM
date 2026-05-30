// client/components/user/molecules/BestTimeToVisitPlace/BestTimeToVisitPlace.tsx
"use client";

import {
  CSSProperties,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiUrl } from "@/utils/api";
import {
  ICON,
  MONTH_LABEL,
  MonthKey,
  computeBestTimeMonths,
  ratingClass,
  splitNote,
} from "@/utils/bestTimeToVisit";
import "./BestTimeToVisitPlace.scss";

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

type Props = {
  placeId: number | string;
  placeNameDative?: string;
};

export default function BestTimeToVisitPlace({
  placeId,
  placeNameDative,
}: Props) {
  const [placeClimate, setPlaceClimate] = useState<ApiBestTimePlace | null>(
    null
  );
  const [activeMonthKey, setActiveMonthKey] = useState<MonthKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBestTimeData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${apiUrl}/place-best-time-to-visit/place/${placeId}`,
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

    if (placeId) {
      fetchBestTimeData();
    } else {
      setIsLoading(false);
      setPlaceClimate(null);
    }

    return () => {
      isMounted = false;
    };
  }, [placeId]);

  useEffect(() => {
    setActiveMonthKey(null);
  }, [placeId]);

  const computed = useMemo(() => {
    if (!placeClimate?.months || placeClimate.months.length === 0) return null;

    return computeBestTimeMonths(placeClimate.months);
  }, [placeClimate]);

  if (isLoading) return null;
  if (!placeClimate || !computed) return null;

  const titlePlaceName =
    placeClimate.place?.name_dative ||
    placeNameDative ||
    placeClimate.place?.name ||
    "";

  const noteParts = placeClimate.note ? splitNote(placeClimate.note) : null;

  const handleMonthKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    month: MonthKey
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();

    setActiveMonthKey((current) => (current === month ? null : month));
  };

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

      {noteParts && (
        <div className="btv-place-note">
          <div className="btv-place-note-badge" aria-hidden="true">
            <span>★</span>
          </div>

          <div className="btv-place-note-content">
            <p className="btv-place-note-lead">{noteParts.lead}</p>

            {noteParts.rest && (
              <p className="btv-place-note-rest">{noteParts.rest}</p>
            )}
          </div>
        </div>
      )}

      <div className="btv-place-grid" role="list">
        {computed.months.map((m) => (
          <div
            key={m.month}
            className={`btv-place-month ${ratingClass(m.rating)} ${
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
            <div className="btv-place-month-label">{MONTH_LABEL[m.month]}</div>

            <div className="btv-place-month-icon" aria-hidden="true">
              {ICON[m.icon]}
            </div>

            <div className="btv-place-month-temp">{m.tempC}°C</div>

            <div className="btv-place-bar-wrap" aria-hidden="true">
              <div
                className="btv-place-bar"
                style={
                  {
                    "--btv-place-bar-size": `${m.heightPct}%`,
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
