"use client";
import {Fragment,useId,useRef,useState} from 'react';
import {ArrowSquareOut} from '@phosphor-icons/react';
import Button from '@/components/atoms/Button';
import CountryFlag from '@/components/admin/atoms/CountryFlag';
import AirlineBadge from '@/components/admin/atoms/AirlineBadge';
import FlightStopsBadge from '@/components/admin/atoms/FlightStopsBadge';
import DealFlightPriceEditor from './DealFlightPriceEditor';
import DealManualFlightForm from './DealManualFlightForm';
import {dealFinderApi as api,type DealJson} from '@/utils/dealFinder';
import {formatFlightDate,tripNights,cheapFlightThreshold} from '@/utils/dealFinderFlights.mjs';
import {flightSelectionRows,sortFlightSelectionRows,selectedDestinationCounts} from '@/utils/dealFinderFlightRows.mjs';
import './LowCostCandidates.scss';
import './DealFlightTable.scss';

type Row={key:string,flight:DealJson,index:number|null,candidateId:string|null};
type Props={offer:DealJson,selected:number[],busy:boolean,action:(fn:()=>Promise<void>)=>Promise<void>,onToggle:(index:number,checked:boolean)=>void,onConfirmed:(index:number)=>Promise<void>,onUpdated:()=>Promise<void>};
const formatter=new Intl.NumberFormat('hr-HR',{style:'currency',currency:'EUR'});
const price=(cents:number)=>formatter.format(cents/100);
const modes=[['price','Najjeftiniji'],['duration','Najkraće putovanje'],['price_duration','Najjeftiniji + najkraći'],['weekend','Weekend break'],['date','Datum polaska']];
export default function DealFlightTable({offer,selected,busy,action,onToggle,onConfirmed,onUpdated}:Props){
  const [sort,setSort]=useState('price'),[page,setPage]=useState(0),[editing,setEditing]=useState<string|null>(null);
  const [manualOpen,setManualOpen]=useState(false);
  const id=useId(),tableTop=useRef<HTMLElement>(null);
  const counts=selectedDestinationCounts(offer.data.flights,selected);
  function changePage(value:number){setPage(value);setEditing(null);requestAnimationFrame(()=>tableTop.current?.scrollIntoView({block:'start',behavior:'smooth'}));}
  const rows:Row[]=flightSelectionRows(offer.data.flights,offer.flightSearch?.pairing?.enabled?offer.data.flightCandidates||[]:[]);
  const sorted=sortFlightSelectionRows(rows,sort);
  const threshold=cheapFlightThreshold(rows.map(row=>row.flight) as {departureDate:string,returnDate:string,priceCents:number}[]);
  const pages=Math.max(1,Math.ceil(rows.length/25)),currentPage=Math.min(page,pages-1);
  return <section ref={tableTop} className="df-unified-flights" aria-label="Svi termini letova">
    <div className="df-flight-toolbar"><span>{rows.length} termina · {selected.length} odabrano</span><Button white disabled={busy} onClick={()=>{setManualOpen(!manualOpen);setEditing(null);}}>Ručno dodaj let</Button><label>Sortiraj termine<select value={sort} onChange={e=>{setSort(e.target.value);setPage(0);setEditing(null);}}>{modes.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label></div>
    {manualOpen&&<DealManualFlightForm offer={offer} busy={busy} action={action} onComplete={async index=>{await onConfirmed(index);setPage(0);setManualOpen(false);}} onCancel={()=>setManualOpen(false)}/>}
    <div className="df-hotel-table-scroll"><table className="df-hotel-table df-flight-selection-table"><caption className="df-sr-only">Postojeći i dodatni termini letova za odabir u članak</caption><thead><tr><th scope="col">Odabir</th><th scope="col">Termin putovanja</th><th scope="col">Prijevoznik</th><th scope="col">Povratno po osobi</th><th scope="col">Poveznica i cijena</th></tr></thead><tbody>{sorted.slice(currentPage*25,(currentPage+1)*25).map(({index:rowIndex,weekendRank})=>{
      const row=rows[rowIndex],flight=row.flight,candidate=row.candidateId!==null,isEditing=editing===row.key,checked=row.index!==null&&selected.includes(row.index),inputId=`${id}-${rowIndex}`;
      return <Fragment key={row.key}><tr className={checked||isEditing?'is-selected':''}><td><input id={inputId} type="checkbox" aria-label={`Odaberi ${flight.destinationName||flight.destination}, ${flight.departureDate} do ${flight.returnDate}`} disabled={busy} checked={candidate?isEditing:checked} onChange={e=>{if(row.index!==null)onToggle(row.index,e.target.checked);else setEditing(e.target.checked?row.key:null);}}/></td><td><label htmlFor={inputId} className="df-flight-date-label">{offer.data.type==='roundup'&&<strong className="df-roundup-destination"><CountryFlag country={flight.destinationCountry}/>{flight.destinationName||flight.destination} ({flight.destination})</strong>}<span>{formatFlightDate(flight.departureDate)}</span><small>do {formatFlightDate(flight.returnDate)} · {tripNights(flight as {departureDate:string,returnDate:string,priceCents:number})} noći</small>{checked&&<small className="df-selected-destination-count">({counts[flight.destination]||0} odabrano za {flight.destinationName||flight.destination})</small>}</label><div className="df-flight-badges">{flight.available!==false&&threshold!==null&&flight.priceCents<=threshold&&<span className="df-badge df-badge-cheap">Među najjeftinijima</span>}{weekendRank<2&&<span className="df-badge df-badge-weekend">{weekendRank===0?'Weekend break':'Produženi vikend'}</span>}</div></td><td><AirlineBadge flight={flight}/><FlightStopsBadge flight={flight}/>{!flight.airline&&!flight.airlineCode&&<small>Prijevoznik nije naveden</small>}</td><td><strong>{price(flight.priceCents)}</strong><small>{candidate?'Procjena iz kalendara':flight.reviewStatus==='verified'?'Ručno provjereno':flight.available===false?'Nedostupno':'Cijena nije potvrđena'}</small></td><td><div className="df-candidate-actions">{flight.skyscannerUrl&&<a href={flight.skyscannerUrl} target="_blank" rel="sponsored noopener noreferrer">Skyscanner<ArrowSquareOut size={15}/></a>}<button type="button" className="df-text-button" disabled={busy} aria-expanded={isEditing} onClick={()=>setEditing(isEditing?null:row.key)}>{candidate?'Potvrdi cijenu':'Uredi cijenu'}</button></div></td></tr>
      {isEditing&&<tr className="df-candidate-editor-row"><td colSpan={5}><DealFlightPriceEditor key={row.key} busy={busy} action={action} initialPrice={candidate?undefined:flight.priceCents/100} initialCarrier={flight.airlineCode} initialOutboundCarrier={flight.outboundAirlineCode} initialInboundCarrier={flight.inboundAirlineCode} submitLabel={candidate?'Potvrdi cijenu i odaberi':'Spremi cijenu'} onSave={async fields=>{if(candidate){const result=await api(`/offers/${offer.id}/confirm-candidate`,{candidateId:row.candidateId,...fields});await onConfirmed(result.index);}else{await api(`/offers/${offer.id}/verify`,{kind:'flight',index:row.index,quickPrice:true,...fields});await onUpdated();}setEditing(null);setPage(0);}} onCancel={()=>setEditing(null)}/></td></tr>}
      </Fragment>;
    })}</tbody></table></div>
    {!rows.length&&<p>Nema pronađenih termina.</p>}
    {pages>1&&<div className="df-candidate-pagination"><Button white disabled={currentPage===0} onClick={()=>changePage(currentPage-1)}>Prethodna</Button><span>{currentPage*25+1}-{Math.min((currentPage+1)*25,rows.length)} od {rows.length}</span><Button white disabled={currentPage>=pages-1} onClick={()=>changePage(currentPage+1)}>Sljedeća</Button></div>}
  </section>;
}
