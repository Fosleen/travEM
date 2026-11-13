import { mkdir, readFile, writeFile, rename, rmdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const fail = (message, status = 400) => Object.assign(new Error(message), { status });
const CACHE_MS = 180 * 24 * 60 * 60 * 1000;
const DEFAULT_DIR = fileURLToPath(new URL('../../.runtime/meteostat', import.meta.url));

export function coordinates(input) {
  const number = (value, limit) => {
    if (!['string', 'number'].includes(typeof value) || String(value).trim() === '') throw fail('Unesite koordinate reprezentativnog mjesta.');
    const result = Number(String(value).trim().replace(',', '.'));
    if (!Number.isFinite(result) || Math.abs(result) > limit) throw fail('Koordinate nisu ispravne.');
    return Number(result.toFixed(4));
  };
  return { latitude: number(input.latitude, 90), longitude: number(input.longitude, 180) };
}

export function normalizeNormals(payload) {
  // Never mix reference periods or interpret null as zero.
  const rows = payload?.data;
  if (!Array.isArray(rows)) throw fail('Meteostat nije vratio klimatske podatke.', 502);
  const matching = rows.filter(row =>
    (row.start === undefined || row.start === 1991) && (row.end === undefined || row.end === 2020));
  if (matching.length !== 12 || new Set(matching.map(row => row.month)).size !== 12) {
    throw fail('Za razdoblje 1991.-2020. nema potpunih podataka za svih 12 mjeseci. Zadržite ručni unos ili odaberite drugo reprezentativno mjesto.', 422);
  }
  return MONTHS.map((month_key, index) => {
    const row = matching.find(item => item.month === index + 1);
    if (!row || !Number.isFinite(row.tavg) || row.tavg < -100 || row.tavg > 70 ||
      !Number.isFinite(row.prcp) || row.prcp < 0 || row.prcp > 10000) {
      throw fail('Nedostaje valjana temperatura ili količina oborina za pojedine mjesece. Ručni unos ostaje dostupan.', 422);
    }
    return { month_key, avg_temp_c: Math.round(row.tavg * 10) / 10, avg_rain_mm: Math.round(row.prcp * 10) / 10 };
  });
}

// Separate local state, never the application's shared database. A directory lock
// serializes reservations across processes sharing this directory. Fail closed
// on unreadable state or a held lock; do not silently reset the quota counter.
export function createFileStore(directory = DEFAULT_DIR) {
  return {
    async transaction(work) {
      await mkdir(directory, { recursive: true });
      const lock = path.join(directory, 'lock');
      try { await mkdir(lock); }
      catch (error) {
        if (error.code === 'EEXIST') throw fail('Drugi dohvat je u tijeku. Pokušajte ponovno nakon nekoliko sekundi.', 409);
        throw error;
      }
      try {
        const filename = path.join(directory, 'state.json');
        let state;
        try { state = JSON.parse(await readFile(filename, 'utf8')); }
        catch (error) {
          if (error.code !== 'ENOENT') throw fail('Brojač Meteostat poziva nije dostupan. Dohvat je zaustavljen radi zaštite kvote.', 503);
          state = { usage: {}, cache: {} };
        }
        if (!state?.usage || !state?.cache) throw fail('Brojač Meteostat poziva nije ispravan.', 503);
        const save = async () => {
          await writeFile(path.join(directory, 'state.tmp'), JSON.stringify(state), { mode: 0o600 });
          await rename(path.join(directory, 'state.tmp'), filename);
        };
        return await work(state, save);
      } finally { await rmdir(lock); }
    },
  };
}

export function createMeteostatService({ store = createFileStore(process.env.METEOSTAT_STATE_DIR), fetcher = fetch, env = process.env, now = () => new Date() } = {}) {
  const limit = () => {
    const value = Number(env.METEOSTAT_MONTHLY_LIMIT ?? 450);
    if (!Number.isInteger(value) || value < 1 || value > 450) throw fail('METEOSTAT_MONTHLY_LIMIT mora biti cijeli broj od 1 do 450.', 503);
    return value;
  };
  const budget = (state, date) => {
    const cutoff = date.getTime() - 31 * 24 * 60 * 60 * 1000;
    let used = 0;
    for (const [day, count] of Object.entries(state.usage)) {
      if (!Number.isInteger(count) || count < 0 || !/^\d{4}-\d{2}(?:-\d{2})?$/.test(day)) throw fail('Brojač Meteostat poziva nije ispravan.', 503);
      // Older month-only counters are counted conservatively from month end.
      const timestamp = day.length === 7
        ? Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)), 1) - 1
        : Date.parse(`${day}T23:59:59.999Z`);
      if (!Number.isFinite(timestamp)) throw fail('Brojač Meteostat poziva nije ispravan.', 503);
      if (timestamp > cutoff) used += count;
    }
    return { windowDays: 31, used, limit: limit(), remaining: Math.max(0, limit() - used) };
  };
  return {
    status: () => store.transaction(async state => ({ configured: Boolean(env.METEOSTAT_RAPIDAPI_KEY), budget: budget(state, now()) })),
    async preview(input) {
      const location = coordinates(input);
      return store.transaction(async (state, save) => {
        const date = now();
        const key = `1991-2020:${location.latitude}:${location.longitude}`;
        const cached = state.cache[key];
        if (cached && date.getTime() - Date.parse(cached.fetchedAt) < CACHE_MS) {
          return { ...cached, cached: true, budget: budget(state, date) };
        }
        if (!env.METEOSTAT_RAPIDAPI_KEY) throw fail('Na backendu postavite METEOSTAT_RAPIDAPI_KEY.', 503);
        const currentBudget = budget(state, date);
        if (!currentBudget.remaining) throw fail('Dosegnut je mjesečni limit Meteostat poziva. Ručni unos ostaje dostupan.', 429);
        // Reserve before any network call. Failed requests also consume budget.
        const day = date.toISOString().slice(0, 10);
        state.usage[day] = (state.usage[day] ?? 0) + 1;
        await save();
        const url = new URL('https://meteostat.p.rapidapi.com/point/normals');
        Object.entries({ lat: location.latitude, lon: location.longitude, start: 1991, end: 2020, units: 'metric' }).forEach(([key, value]) => url.searchParams.set(key, value));
        let response;
        try {
          response = await fetcher(url, {
            headers: { 'x-rapidapi-host': 'meteostat.p.rapidapi.com', 'x-rapidapi-key': env.METEOSTAT_RAPIDAPI_KEY },
            signal: AbortSignal.timeout(20000),
          });
        } catch { throw fail('Meteostat trenutačno nije dostupan. Pokušajte kasnije; ručni unos ostaje dostupan.', 502); }
        if (!response.ok) {
          const message = response.status === 429 ? 'Meteostat kvota je potrošena ili je ograničena brzina poziva.' :
            [401, 403].includes(response.status) ? 'Provjerite Meteostat API ključ i aktivnu RapidAPI pretplatu na backendu.' : 'Meteostat trenutačno ne može vratiti podatke.';
          throw fail(message, response.status === 429 ? 429 : 502);
        }
        let payload;
        try { payload = await response.json(); } catch { throw fail('Meteostat je vratio neispravan odgovor.', 502); }
        const result = {
          months: normalizeNormals(payload), source: 'Meteostat and its data providers',
          sourceUrl: 'https://meteostat.net/', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
          startYear: 1991, endYear: 2020, ...location, fetchedAt: date.toISOString(),
        };
        state.cache[key] = result;
        await save();
        return { ...result, cached: false, budget: budget(state, date) };
      });
    },
  };
}
