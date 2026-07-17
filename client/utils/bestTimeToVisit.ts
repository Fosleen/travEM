export type MonthKey =
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

export type WeatherIconKey =
  | "sunny"
  | "partly_cloudy"
  | "cloudy"
  | "rain"
  | "showers"
  | "snow"
  | "wind"
  | "fog";

export type BestTimeRating = "Najbolje" | "Dobro" | "U redu" | "Loše";

export type BestTimeMonthInput = {
  month_key: MonthKey;
  avg_temp_c: string | number;
  avg_rain_mm: string | number;
};

export type ComputedBestTimeMonth = {
  month: MonthKey;
  tempC: number;
  rainMm: number;
  rating: BestTimeRating;
  icon: WeatherIconKey;
  heightPct: number;
};

export const MONTH_LABEL: Record<MonthKey, string> = {
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

export const MONTH_ORDER: MonthKey[] = [
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

export const ICON: Record<WeatherIconKey, string> = {
  sunny: "☀️",
  partly_cloudy: "⛅",
  cloudy: "☁️",
  rain: "🌧️",
  showers: "🌦️",
  snow: "❄️",
  wind: "💨",
  fog: "🌫️",
};

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function tempComfortScore(tempC: number) {
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

export function rainDryScore(
  rainMm: number,
  minRain: number,
  maxRain: number
) {
  const span = Math.max(1, maxRain - minRain);
  const norm = (rainMm - minRain) / span;

  return 1 - clamp(norm, 0, 1);
}

export function monthScore(
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

export function assignRatingsByRank(monthKeysSortedBestToWorst: MonthKey[]) {
  const ratingByMonth = new Map<MonthKey, BestTimeRating>();
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

export function computeIcon(
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

export function ratingClass(rating: BestTimeRating) {
  if (rating === "Najbolje") return "best";
  if (rating === "Dobro") return "good";
  if (rating === "U redu") return "variable";

  return "poor";
}

export function splitNote(note: string) {
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

export function normalizeSlug(slug: string) {
  return decodeURIComponent(slug).toLowerCase();
}

export function computeBestTimeMonths(months: BestTimeMonthInput[]) {
  const normalizedMonths = [...months]
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

  const computedMonths: ComputedBestTimeMonth[] = normalizedMonths.map((m) => {
    const rating = ratingByMonth.get(m.month) ?? "U redu";
    const icon = computeIcon(m.tempC, m.rainMm, minRain, maxRain);
    const h = ((m.tempC - minT) / range) * 100;
    const heightPct = clamp(h, 12, 100);

    return { ...m, rating, icon, heightPct };
  });

  return { months: computedMonths, minT, maxT };
}
