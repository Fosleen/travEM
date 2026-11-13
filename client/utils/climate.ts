import { apiUrl } from './api';

export type ClimatePreview = {
  months: { month_key: string; avg_temp_c: number; avg_rain_mm: number }[];
  startYear: number;
  endYear: number;
  latitude: number;
  longitude: number;
  fetchedAt: string;
  cached: boolean;
  budget: { used: number; limit: number; remaining: number };
};

export async function previewClimate(latitude: string | number, longitude: string | number, signal: AbortSignal): Promise<ClimatePreview> {
  const response = await fetch(`${apiUrl}/admin/climate/preview`, {
    method: 'POST', signal,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('jwt')}` },
    body: JSON.stringify({ latitude, longitude }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Dohvat klimatskih podataka nije uspio.');
  return result;
}

export const CLIMATE_SOURCE_PREFIX = 'Izvor klimatskih podataka: Meteostat';

export function splitClimateNote(note: string | null | undefined) {
  const lines = (note || '').split('\n');
  return {
    note: lines.filter(line => !line.startsWith(CLIMATE_SOURCE_PREFIX)).join('\n').trim(),
    attribution: lines.find(line => line.startsWith(CLIMATE_SOURCE_PREFIX)) || '',
  };
}

