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

function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // delete
        dp[i][j - 1] + 1, // insert
        dp[i - 1][j - 1] + cost // replace
      );
    }
  }
  return dp[m][n];
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

  // nađi najbližu poznatu domenu
  let best: { d: string; dist: number } | null = null;

  for (const d of commonDomains) {
    const dist = levenshtein(domain, d);
    if (!best || dist < best.dist) best = { d, dist };
    if (dist === 0) break;
  }

  if (!best) return null;

  // prag: kratke domene su osjetljivije
  const maxAllowed = domain.length <= 10 ? 1 : 2;

  if (best.dist > 0 && best.dist <= maxAllowed) {
    return `${local}@${best.d}`;
  }

  // izgleda kao custom domena -> ne diraj
  return null;
}
