// client/utils/email.ts

export const COMMON_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",

  "icloud.com",
  "me.com",
  "mac.com",

  "yahoo.com",
  "yahoo.co.uk",
  "ymail.com",
  "rocketmail.com",

  "proton.me",
  "protonmail.com",
  "tutanota.com",
  "tuta.com",

  "aol.com",
  "zoho.com",
  "mail.com",

  // regionalno česte
  "gmx.com",
  "gmx.net",
  "web.de",
  "t-online.de",
];

export const normalizeEmail = (raw: string) => raw.trim().toLowerCase();

// FE regex (dovoljno dobar) + ne blokira custom domene
export const isBasicValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Calculates Levenshtein distance only up to maxDistance.
 * Returns maxDistance + 1 as soon as it is clear that the distance is too large.
 */
function levenshteinWithinLimit(
  a: string,
  b: string,
  maxDistance: number
): number {
  const m = a.length;
  const n = b.length;

  if (Math.abs(m - n) > maxDistance) {
    return maxDistance + 1;
  }

  if (m === 0) return n <= maxDistance ? n : maxDistance + 1;
  if (n === 0) return m <= maxDistance ? m : maxDistance + 1;

  let previousRow = Array.from({ length: n + 1 }, (_, index) => index);
  let currentRow = new Array(n + 1);

  for (let i = 1; i <= m; i++) {
    currentRow[0] = i;

    let rowMin = currentRow[0];

    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      currentRow[j] = Math.min(
        previousRow[j] + 1,
        currentRow[j - 1] + 1,
        previousRow[j - 1] + cost
      );

      rowMin = Math.min(rowMin, currentRow[j]);
    }

    if (rowMin > maxDistance) {
      return maxDistance + 1;
    }

    [previousRow, currentRow] = [currentRow, previousRow];
  }

  return previousRow[n] <= maxDistance ? previousRow[n] : maxDistance + 1;
}

/**
 * Pokušaj ispravka domene:
 * - ako je domena točna (u COMMON_DOMAINS) -> null
 * - ako je domena tipfeler blizak poznatoj -> vrati ispravljeni email
 * - ako je custom domena -> null (ne diraj)
 */
export function suggestEmailCorrection(
  email: string,
  commonDomains: string[] = COMMON_DOMAINS
) {
  const at = email.lastIndexOf("@");
  if (at === -1) return null;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);

  if (!local || !domain) return null;

  // već poznata domena -> nema korekcije
  if (commonDomains.includes(domain)) return null;

  // najčešće tipfelere brzo pokrij
  const quickMap: Record<string, string> = {
    "gmil.com": "gmail.com",
    "gmai.com": "gmail.com",
    "gmail.con": "gmail.com",
    "gnail.com": "gmail.com",
    "gmal.com": "gmail.com",

    "outlok.com": "outlook.com",
    "outllok.com": "outlook.com",
    "outlook.con": "outlook.com",

    "hotnail.com": "hotmail.com",
    "hotmai.com": "hotmail.com",
    "hotmail.con": "hotmail.com",

    "icoud.com": "icloud.com",
    "icloud.con": "icloud.com",

    "yaho.com": "yahoo.com",
    "yahoo.con": "yahoo.com",

    "protonmai.com": "protonmail.com",
    "protonmail.con": "protonmail.com",

    "tutanota.con": "tutanota.com",
    "tuta.con": "tuta.com",
  };

  if (quickMap[domain]) return `${local}@${quickMap[domain]}`;

  // prag: kratke domene su osjetljivije
  const maxAllowed = domain.length <= 10 ? 1 : 2;

  // nađi najbližu poznatu domenu, ali računaj udaljenost samo do dozvoljenog praga
  let best: { d: string; dist: number } | null = null;

  for (const d of commonDomains) {
    const dist = levenshteinWithinLimit(domain, d, maxAllowed);

    if (dist <= maxAllowed && (!best || dist < best.dist)) {
      best = { d, dist };
    }

    if (dist === 1) {
      break;
    }
  }

  if (!best) return null;

  return `${local}@${best.d}`;
}