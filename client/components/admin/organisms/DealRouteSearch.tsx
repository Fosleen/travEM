"use client";
import {useEffect,useRef,useState} from 'react';
import {MagnifyingGlass} from '@phosphor-icons/react';
import Button from '@/components/atoms/Button';
import {dealFinderApi as api,type DealJson} from '@/utils/dealFinder';
import {searchWindowDays,nextSearchDate} from '@/utils/dealFinderSearch.mjs';
import {offerSummary} from '@/utils/dealFinderOffers.mjs';
type Props={offer:DealJson,busy:boolean,action:(fn:()=>Promise<void>)=>Promise<void>,onComplete:()=>Promise<void>};

export default function DealRouteSearch({offer,busy,action,onComplete}:Props) {
  const completion=useRef(onComplete);
  useEffect(()=>{completion.current=onComplete;},[onComplete]);
  const source=offer.flightSearch?.window,minimum=source?.minimumDays||1;
  const [start,setStart]=useState(source?.start||''),[end,setEnd]=useState(source?.end||'');
  const budget=offer.flightSearch?.budgetDates,eligible=Boolean(budget?.airlineCodes?.length);
  const cheapest=offerSummary(offer).cheapestFlight;
  const originalDuration=cheapest?searchWindowDays(cheapest.departureDate,cheapest.returnDate):2;
  const [mode,setMode]=useState(eligible?'budget_dates':'calendar'),[days,setDays]=useState(Math.min(searchWindowDays(source?.start,source?.end)||60,60,Math.max(originalDuration,minimum)));
  const [minimumDays,setMinimumDays]=useState(minimum);
  const [runId,setRunId]=useState<number|null>(offer.flightSearch?.pendingRunId||null),[message,setMessage]=useState('');
  const span=searchWindowDays(start,end),valid=Number.isInteger(span)&&span>=1&&Number.isInteger(minimumDays)&&minimumDays>=1&&minimumDays<=span&&(mode!=='calendar'||Number.isInteger(days)&&days>=minimumDays&&days<=Math.min(span,60))&&(mode!=='budget_dates'||span<=366&&budget?.enabled&&eligible);
  const queries=valid?(mode==='budget_dates'?2:mode==='calendar'?1:span-minimumDays+1):0;
  const limit=offer.flightSearch?.maxQueries??0,remaining=offer.flightSearch?.budget?.remaining??0;
  const allowed=valid&&queries>0&&queries<=limit&&queries<=remaining&&offer.flightSearch?.enabled;
  useEffect(()=>{
    if(runId===null)return;
    let cancelled=false;
    const timer=setInterval(async()=>{
      try {
        const run=await api(`/runs/${runId}`);if(cancelled)return;
        if(run.status==='completed'){clearInterval(timer);setRunId(null);setMessage('Pretraga je završena. Rezultati su spremljeni u ovoj ponudi.');await completion.current();}
        else if(run.status==='failed'){clearInterval(timer);setRunId(null);setMessage(run.error||'Dodatna pretraga nije uspjela.');await completion.current();}
      }catch{if(!cancelled)setMessage('Status pretrage trenutačno nije dostupan. Provjera statusa nastavlja se bez novih plaćenih upita.');}
    },3000);
    return()=>{cancelled=true;clearInterval(timer);};
  },[runId]);

  return <details className="df-advanced df-route-search"><summary>Pronađi još termina na ovoj ruti</summary>
    <p><strong>{offer.originName||offer.origin} ({offer.origin}) → {offer.destinationName||offer.destination} ({offer.destination})</strong></p>
    {source?<p>Izvorna pretraga: {source.start} – {source.end}. Raspon možeš prilagoditi za ovu rutu.</p>:<p>Izvorni raspon nije spremljen. Upiši razdoblje za dodatne termine.</p>}
    {mode==='calendar'&&<p>Kalendar traži točno {days} dana između polaska i povratka. Početno trajanje preuzeto je iz najjeftinijeg pronađenog termina; raspon datuma određuje u kojem razdoblju tražimo takva putovanja.</p>}
    <label>Način dopune<select value={mode} disabled={runId!==null||busy} onChange={e=>setMode(e.target.value)}>{eligible?<option value="budget_dates">Sve procijenjene kombinacije · 2 upita</option>:<><option value="calendar">Kalendar za odabrano trajanje · 1 upit</option><option value="route">Različita trajanja · više upita</option></>}</select></label>
    <fieldset disabled={runId!==null||busy}><legend>Razdoblje putovanja</legend><div className="grid">
      <label>Od datuma<input type="date" value={start} onChange={e=>setStart(e.target.value)}/></label>
      <label>Do datuma<input type="date" value={end} min={start?nextSearchDate(start):undefined} onChange={e=>setEnd(e.target.value)}/></label>
      {mode==='calendar'?<label>Trajanje putovanja (dana)<input type="number" min={minimumDays} max={Math.min(span||60,60)} step={1} value={days} onChange={e=>setDays(Number(e.target.value))}/></label>:<label>Minimalno trajanje (dana)<input type="number" min={1} step={1} value={minimumDays} onChange={e=>setMinimumDays(Number(e.target.value))}/></label>}
    </div></fieldset>
    <p>{mode==='budget_dates'?'Dva kalendara za cijeli raspon daju jednosmjerne cijene. Spajamo sve dopuštene datume i sortiramo kombinacije po zbroju cijena. Prijevoznik nije ograničen. Svaka procjena ima jednu Skyscanner poveznicu za oba datuma; dodatnih automatskih API upita nema.':mode==='calendar'?'Jedan upit traži više datuma polaska za isto trajanje. Ponovi za drugo trajanje ako želiš dodatne opcije.':'Za svaki mogući datum polaska traže se povratci do kraja raspona, uz zadani minimum. Ova opcija može potrošiti znatno više upita.'} Polazak i povratak ostaju unutar raspona.</p>
    {!valid&&<p className="error">Provjeri datume i trajanje putovanja.</p>}
    {valid&&(queries>limit||queries>remaining)&&<p className="error">Plan od {queries} upita prelazi limit po pretrazi ({limit}) ili preostalu kvotu ({remaining}). Skrati raspon ili odaberi kalendar jednog trajanja.</p>}
    {!offer.flightSearch?.enabled&&<p>Live pretrage nisu omogućene na serveru ili u Postavkama.</p>}
    <Button white disabled={busy||runId!==null||!allowed} onClick={()=>action(async()=>{const run=await api(`/offers/${offer.id}/search-flights`,{mode,start,end,days,minimumDays,confirmedQueries:queries});setRunId(run.id);setMessage(`Pretraga je pokrenuta · ${queries} API upita. Smještaj se ne pretražuje.`);})}><MagnifyingGlass size={18}/>{runId!==null?'Tražimo dodatne termine…':`Pronađi još termina · ${queries} API upita`}</Button>
    {message&&<p role="status">{message}</p>}
    {offer.provenance?.lastFlightSearch&&<p>Posljednja dopuna: {offer.provenance.lastFlightSearch.added} novih termina, {offer.provenance.lastFlightSearch.updated} ažuriranih.</p>}
    {mode==='budget_dates'&&offer.provenance?.lastPairSearch&&<p>Posljednji pregled: {offer.provenance.lastPairSearch.totalCombinations} procijenjenih kombinacija · {offer.provenance.lastPairSearch.start} – {offer.provenance.lastPairSearch.end}.</p>}
  </details>;
}
