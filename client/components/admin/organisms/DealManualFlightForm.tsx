"use client";
import {useState} from 'react';
import DealFlightPriceEditor from './DealFlightPriceEditor';
import {parseManualFlightLink} from '@/utils/dealFinderManualFlights.mjs';
import {dealFinderApi as api,type DealJson} from '@/utils/dealFinder';
type Props={offer:DealJson,busy:boolean,action:(fn:()=>Promise<void>)=>Promise<void>,onComplete:(index:number)=>Promise<void>,onCancel:()=>void};
export default function DealManualFlightForm({offer,busy,action,onComplete,onCancel}:Props){
  const destinations:{code:string,name:string}[]=offer.data.type==='roundup'?offer.destinations:[{code:offer.destination,name:offer.destinationName||offer.destination}];
  const [destination,setDestination]=useState(destinations.length===1?destinations[0].code:'');
  const [sourceUrl,setSourceUrl]=useState(''),[departureDate,setDepartureDate]=useState(''),[returnDate,setReturnDate]=useState('');
  const [initialPrice,setInitialPrice]=useState<number|undefined>(),[carrier,setCarrier]=useState<string|undefined>();
  const [outboundCarrier,setOutboundCarrier]=useState<string|undefined>(),[inboundCarrier,setInboundCarrier]=useState<string|undefined>();
  const [outboundStops,setOutboundStops]=useState(''),[inboundStops,setInboundStops]=useState('');
  const [version,setVersion]=useState(0),[error,setError]=useState('');
  const valid=Boolean(destination&&departureDate&&returnDate&&returnDate>departureDate);
  function loadLink(){
    try{
      const parsed=parseManualFlightLink(sourceUrl);
      if(parsed.origin&&parsed.origin!==offer.origin)throw new Error('Polazište poveznice ne odgovara ovoj ponudi.');
      if(parsed.destination&&destinations.some(d=>d.code===parsed.destination))setDestination(parsed.destination);
      if(parsed.departureDate)setDepartureDate(parsed.departureDate);
      if(parsed.returnDate)setReturnDate(parsed.returnDate);
      setInitialPrice(parsed.priceEur);setCarrier(parsed.airlineCode);setOutboundCarrier(parsed.outboundAirlineCode);setInboundCarrier(parsed.inboundAirlineCode);setVersion(value=>value+1);setError('');
    }catch(e){setError(e instanceof Error?e.message:'Poveznicu nije moguće pročitati.');}
  }
  return <div className="df-saved-flight-editor df-manual-flight-form">
    <h4>Ručno dodaj povratni let</h4><p>Polazište: {offer.originName||offer.origin} ({offer.origin}). Cijena je za jednu osobu.</p>
    <fieldset disabled={busy}><label>Skyscanner poveznica (opcionalno)<input type="url" maxLength={8192} placeholder="https://www.skyscanner.hr/prijevoz/letovi/..." value={sourceUrl} onChange={e=>{setSourceUrl(e.target.value);setError('');}}/></label><button type="button" className="df-text-button" disabled={!sourceUrl.trim()} onClick={loadLink}>Učitaj podatke iz poveznice</button><p>Poveznica služi za popunjavanje i referencu. Za članak se generira affiliate poveznica za potvrđeni aerodrom i datume. Provjeri učitanu cijenu prije spremanja.</p></fieldset>
    {error&&<p className="error" role="alert">{error}</p>}
    <DealFlightPriceEditor key={version} busy={busy} action={action} disabled={!valid} initialPrice={initialPrice} initialCarrier={carrier} initialOutboundCarrier={outboundCarrier} initialInboundCarrier={inboundCarrier} submitLabel="Dodaj let i odaberi za članak" onCancel={onCancel} onSave={async fields=>{const result=await api(`/offers/${offer.id}/manual-flight`,{...fields,destination,departureDate,returnDate,sourceUrl:sourceUrl.trim(),outboundStops:outboundStops===''?null:Number(outboundStops),inboundStops:inboundStops===''?null:Number(inboundStops)});await onComplete(result.index);}}>
      <fieldset disabled={busy}><div className="grid"><label>Odredišni aerodrom<select required value={destination} onChange={e=>setDestination(e.target.value)}><option value="" disabled>Odaberi odredište</option>{destinations.map(d=><option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}</select></label><label>Datum polaska<input required type="date" value={departureDate} onChange={e=>setDepartureDate(e.target.value)}/></label><label>Datum povratka<input required type="date" min={departureDate||undefined} value={returnDate} onChange={e=>setReturnDate(e.target.value)}/></label></div><div className="grid">{[['Odlazni let',outboundStops,setOutboundStops],['Povratni let',inboundStops,setInboundStops]].map(([label,value,setter])=><label key={label as string}>{label as string}<select value={value as string} onChange={e=>(setter as (value:string)=>void)(e.target.value)}><option value="">Presjedanja nisu navedena</option><option value="0">Direktno</option><option value="1">1 presjedanje</option><option value="2">2 presjedanja</option><option value="3">3 presjedanja</option></select></label>)}</div></fieldset>
    </DealFlightPriceEditor>
  </div>;
}
