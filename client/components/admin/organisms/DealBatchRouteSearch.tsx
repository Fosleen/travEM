"use client";
import {useEffect,useRef,useState} from 'react';
import {MagnifyingGlass} from '@phosphor-icons/react';
import Button from '@/components/atoms/Button';
import CountryFlag from '@/components/admin/atoms/CountryFlag';
import {dealFinderApi as api,type DealJson} from '@/utils/dealFinder';
import {searchWindowDays,nextSearchDate} from '@/utils/dealFinderSearch.mjs';

type Props={offer:DealJson,busy:boolean,action:(fn:()=>Promise<void>)=>Promise<void>,onComplete:()=>Promise<void>};
export default function DealBatchRouteSearch({offer,busy,action,onComplete}:Props){
  const completion=useRef(onComplete);
  useEffect(()=>{completion.current=onComplete;},[onComplete]);
  const source=offer.flightSearch?.window,minimum=source?.minimumDays||1;
  const [start,setStart]=useState(source?.start||''),[end,setEnd]=useState(source?.end||'');
  const [legacyMode,setLegacyMode]=useState('calendar'),[minimumDays,setMinimumDays]=useState(minimum);
  const [days,setDays]=useState(Math.min(searchWindowDays(source?.start,source?.end)||60,60,Math.max(2,minimum)));
  const [selected,setSelected]=useState<string[]>([]);
  const [results,setResults]=useState<DealJson[]>([]);
  const [runId,setRunId]=useState<number|null>(offer.flightSearch?.pendingRunId||null),[message,setMessage]=useState(''),[progress,setProgress]=useState('');
  const destinations:{code:string,name:string,country?:string}[]=offer.destinations||[];
  const routes=destinations.map(destination=>({...destination,budget:Boolean(offer.flightSearch?.routes?.find((route:DealJson)=>route.destination===destination.code)?.airlineCodes?.length)}));
  const selectedRoutes=routes.filter(route=>selected.includes(route.code));
  const hasLegacy=selectedRoutes.some(route=>!route.budget),hasBudget=selectedRoutes.some(route=>route.budget);
  const span=searchWindowDays(start,end),calendar=hasLegacy&&legacyMode==='calendar';
  const datesValid=Number.isInteger(span)&&span>=1&&Number.isInteger(minimumDays)&&minimumDays>=1&&minimumDays<=span;
  const valid=datesValid&&selectedRoutes.length>0&&(!calendar||Number.isInteger(days)&&days>=minimumDays&&days<=Math.min(span,60))&&(!hasBudget||span<=366&&offer.flightSearch?.budgetDates?.enabled);
  const routeQueries=(route:{budget:boolean})=>route.budget?2:legacyMode==='calendar'?1:span-minimumDays+1;
  const queries=valid?selectedRoutes.reduce((sum,route)=>sum+routeQueries(route),0):0;
  const limit=offer.flightSearch?.maxQueries??0,remaining=offer.flightSearch?.budget?.remaining??0,locked=busy||runId!==null;
  const allowed=valid&&queries>0&&queries<=limit&&queries<=remaining&&offer.flightSearch?.enabled;
  useEffect(()=>{
    if(runId===null)return;
    let cancelled=false;
    const timer=setInterval(async()=>{
      try{
        const run=await api(`/runs/${runId}`);if(cancelled)return;
        if(run.input?.progress){setProgress(`Obrađeno ${run.input.progress.completed} od ${run.input.progress.total} odredišta · ${run.usage} API upita.`);setResults(run.input.progress.results||[]);}
        if(['completed','failed'].includes(run.status)){
          clearInterval(timer);setRunId(null);setMessage(run.status==='completed'?'Pretraga je završena. Rezultati su spremljeni u ovoj ponudi.':run.error||'Dopuna nije uspjela.');await completion.current();
        }
      }catch{if(!cancelled)setMessage('Status pretrage trenutačno nije dostupan. Provjera statusa nastavlja se bez novih API upita.');}
    },3000);
    return()=>{cancelled=true;clearInterval(timer);};
  },[runId]);
  return <details className="df-advanced df-route-search"><summary>Pronađi još termina za odabrana odredišta</summary>
    <p><strong>{offer.originName||offer.origin} ({offer.origin})</strong></p>
    {source&&<p>Izvorna pretraga: {source.start} – {source.end}. Raspon možeš prilagoditi.</p>}
    <fieldset disabled={locked} className="df-batch-destinations"><legend>Odaberi odredišta za dopunu</legend><div className="df-batch-selection-actions"><button type="button" className="df-text-button" onClick={()=>setSelected(destinations.map(d=>d.code))}>Odaberi sve</button><button type="button" className="df-text-button" onClick={()=>setSelected([])}>Poništi odabir</button></div><div className="df-batch-destination-grid">{routes.map(route=><label key={route.code} className={selected.includes(route.code)?'is-selected':''}><input type="checkbox" checked={selected.includes(route.code)} onChange={e=>setSelected(current=>e.target.checked?[...current,route.code]:current.filter(code=>code!==route.code))}/><CountryFlag country={route.country}/><span>{route.name} ({route.code})</span><small>{route.budget?'2 upita':legacyMode==='calendar'?'1 upit':datesValid?`${routeQueries(route)} upita`:'—'}</small></label>)}</div></fieldset>
    {hasLegacy&&<label>Dopuna ruta bez budget prijevoznika<select value={legacyMode} disabled={locked} onChange={e=>setLegacyMode(e.target.value)}><option value="calendar">Kalendar za odabrano trajanje · 1 upit po odredištu</option><option value="route">Različita trajanja · više upita po odredištu</option></select></label>}
    <fieldset disabled={locked}><legend>Razdoblje putovanja</legend><div className="grid"><label>Od datuma<input type="date" value={start} onChange={e=>setStart(e.target.value)}/></label><label>Do datuma<input type="date" value={end} min={start?nextSearchDate(start):undefined} onChange={e=>setEnd(e.target.value)}/></label><label>Minimalno trajanje (dana)<input type="number" min={1} step={1} value={minimumDays} onChange={e=>setMinimumDays(Number(e.target.value))}/></label>{calendar&&<label>Trajanje putovanja za kalendar (dana)<input type="number" min={minimumDays} max={Math.min(span||60,60)} step={1} value={days} onChange={e=>setDays(Number(e.target.value))}/></label>}</div></fieldset>
    <p>Budget rute: dva kalendarska upita po odredištu za cijeli raspon. Algoritam spaja sve dopuštene povratne kombinacije. Ostale rute koriste odabrani način dopune. Rezultati se spremaju u istu ponudu, bez pretrage smještaja.</p>
    {!valid&&<p className="error">{!selectedRoutes.length?'Odaberi barem jedno odredište.':'Provjeri datume, trajanje i dostupnost budget dopune.'}</p>}
    {valid&&(queries>limit||queries>remaining)&&<p className="error">Plan od {queries} upita prelazi limit po pretrazi ({limit}) ili preostalu mjesečnu kvotu ({remaining}). Odaberi manje odredišta ili prilagodi limit u Postavkama.</p>}
    <p className="df-batch-total"><strong>{selectedRoutes.length} odredišta · ukupno {queries} API upita</strong></p>
    <Button white disabled={locked||!allowed} onClick={()=>action(async()=>{const run=await api(`/offers/${offer.id}/search-flights`,{destinations:selected,legacyMode,start,end,days,minimumDays,confirmedQueries:queries});setRunId(run.id);setProgress('');setResults([]);setMessage(`Pretraga je pokrenuta · ${queries} API upita.`);})}><MagnifyingGlass size={18}/>{runId!==null?'Tražimo dodatne termine…':`Pronađi još termina · ${queries} API upita`}</Button>
    {message&&<p role="status">{message}</p>}{progress&&<p role="status">{progress}</p>}
    {results.map(result=><p key={result.destination}><strong>{destinations.find(d=>d.code===result.destination)?.name||result.destination} ({result.destination})</strong>: {result.returned} {result.mode==='budget_dates'?'povratnih kombinacija':'termina'}{result.mode==='budget_dates'&&<> · polaznih datuma: {result.outboundDates}, povratnih datuma: {result.inboundDates}</>}{result.returned===0&&' · API nije vratio odgovarajuće termine; raniji rezultati ostaju sačuvani.'}</p>)}
  </details>;
}
