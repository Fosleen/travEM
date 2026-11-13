'use client';

import { useEffect, useRef, useState } from 'react';
import { getIn, useFormikContext } from 'formik';
import { bestTimeMonths, normalizeNumberForInput } from '@/utils/bestTimeFormHelpers';
import { previewClimate } from '@/utils/climate';
import './ClimateImport.scss';

type Props = { regionIndex?: number };

export default function ClimateImport({ regionIndex }: Props) {
  const { values, setFieldValue } = useFormikContext<Record<string, unknown>>();
  const region = regionIndex !== undefined;
  const target = region ? `best_time_to_visit.regions.${regionIndex}` : 'best_time_to_visit';
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const abort = useRef<AbortController | null>(null);
  const snapshot = useRef('');
  const lat = region ? latitude : String(values.place_latitude ?? '');
  const lon = region ? longitude : String(values.place_longitude ?? '');
  const name = region ? String(getIn(values, `${target}.label`) ?? '') : String(values.place_name ?? '');
  const signature = JSON.stringify([target, getIn(values, target), lat, lon, name]);
  const currentSignature = useRef(signature);
  currentSignature.current = signature;

  useEffect(() => () => abort.current?.abort(), []);

  async function load() {
    if (busy) return;
    setBusy(true);
    setError('');
    setMessage('');
    snapshot.current = signature;
    const controller = new AbortController();
    abort.current = controller;
    try {
      const result = await previewClimate(lat, lon, controller.signal);
      if (controller.signal.aborted) return;
      if (currentSignature.current !== snapshot.current) throw new Error('Podaci u obrascu promijenjeni su tijekom dohvata. Ponovite dohvat za trenutačnu lokaciju.');
      const current = getIn(values, target);
      const months = bestTimeMonths.map(month => {
        const imported = result.months.find(item => item.month_key === month.month_key)!;
        return { month_key: month.month_key, avg_temp_c: normalizeNumberForInput(imported.avg_temp_c), avg_rain_mm: normalizeNumberForInput(imported.avg_rain_mm) };
      });
      await setFieldValue(target, { ...current, months });
      setMessage('Popunjeno je svih 12 mjeseci. Vrijednosti možete urediti prije spremanja obrasca.');
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'Dohvat nije uspio.');
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return (
    <div className="climate-import">
      <p><strong>Automatski unos klimatskih prosjeka - Meteostat API</strong></p>
      {region && <div className="climate-import__coordinates">
        <label>Geografska širina (latitude)<input inputMode="decimal" value={latitude} onChange={event => setLatitude(event.target.value)} placeholder="npr. 43,51" /></label>
        <label>Geografska dužina (longitude)<input inputMode="decimal" value={longitude} onChange={event => setLongitude(event.target.value)} placeholder="npr. 16,44" /></label>
      </div>}
      {!region && <p>Koriste se koordinate unesene za ovo mjesto.</p>}
      <button type="button" disabled={busy} onClick={load}>{busy ? 'Dohvaćam...' : 'Dohvati klimatske podatke'}</button>
      <div aria-live="polite">
        {error && <p role="alert" className="climate-import__error">{error}</p>}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
