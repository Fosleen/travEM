"use client";
import {Fragment,useState} from 'react';
import {ArrowSquareOut,Plus} from '@phosphor-icons/react';
import Button from '@/components/atoms/Button';
import {dealFinderApi as api,type DealJson} from '@/utils/dealFinder';
import {formatFlightDate,sortFlightOptions,tripNights} from '@/utils/dealFinderFlights.mjs';
import DealFlightPriceEditor from './DealFlightPriceEditor';
import './LowCostCandidates.scss';
const priceFormatter=new Intl.NumberFormat('hr-HR',{style:'currency',currency:'EUR'});
const price=(cents:number)=>priceFormatter.format(cents/100);
type Props={offer:DealJson,busy:boolean,action:(fn:()=>Promise<void>)=>Promise<void>,onComplete:(index:number)=>Promise<void>};
export default function LowCostCandidates({offer,busy,action,onComplete}:Props) {
  const [sort,setSort]=useState('price'),[candidateId,setCandidateId]=useState<string|null>(null),[page,setPage]=useState(0);
  const candidates:DealJson[]=offer.data.flightCandidates||[];
  if(!offer.flightSearch?.pairing?.enabled||!candidates.length)return null;
  const sorted=sortFlightOptions(candidates as {departureDate:string,returnDate:string,priceCents:number}[],sort);
  const pages=Math.ceil(sorted.length/25),currentPage=Math.min(page,pages-1);
  return <section className="df-budget-candidates" aria-labelledby="df-candidates-heading">
    <div className="df-candidates-heading"><div><h4 id="df-candidates-heading">Dodatni termini <span>{candidates.length}</span></h4><p>Procjene iz kalendara. Otvori poveznicu i pri dodavanju upiši provjerenu cijenu.</p></div>
      <label>Sortiraj<select value={sort} onChange={e=>{setSort(e.target.value);setPage(0);setCandidateId(null);}}><option value="price">Najjeftiniji</option><option value="duration">Najkraće putovanje</option><option value="price_duration">Najjeftiniji + najkraći</option><option value="weekend">Weekend break</option><option value="date">Datum polaska</option></select></label>
    </div>
    <div className="df-hotel-table-scroll"><table className="df-hotel-table df-candidates-table"><thead><tr><th scope="col">Termin putovanja</th><th scope="col">Procjena povratno</th><th scope="col"><span className="df-sr-only">Radnje</span></th></tr></thead><tbody>{sorted.slice(currentPage*25,(currentPage+1)*25).map(({index})=>{const c=candidates[index],editing=candidateId===c.id;return <Fragment key={c.id}><tr className={editing?'is-selected':''}><td>{offer.data.type==='roundup'&&<strong className="df-roundup-destination">{c.destinationName||c.destination} ({c.destination})</strong>}<span>{formatFlightDate(c.departureDate)}</span><small>do {formatFlightDate(c.returnDate)} · {tripNights(c as {departureDate:string,returnDate:string,priceCents:number})} noći</small></td><td><strong>{price(c.priceCents)}</strong><small>{price(c.outboundPriceCents)} + {price(c.inboundPriceCents)}</small></td><td><div className="df-candidate-actions"><a href={c.skyscannerUrl} target="_blank" rel="sponsored noopener noreferrer" aria-label={`Provjeri termin ${c.departureDate} do ${c.returnDate} na Skyscanneru`}>Skyscanner<ArrowSquareOut size={15}/></a><button type="button" className="df-text-button" aria-expanded={editing} disabled={busy} onClick={()=>setCandidateId(editing?null:c.id)}><Plus size={16}/>Dodaj</button></div></td></tr>{editing&&<tr className="df-candidate-editor-row"><td colSpan={3}><DealFlightPriceEditor key={c.id} busy={busy} action={action} submitLabel="Dodaj u odabrane termine" onSave={async fields=>{const result=await api(`/offers/${offer.id}/confirm-candidate`,{candidateId:c.id,...fields});await onComplete(result.index);}} onCancel={()=>setCandidateId(null)}/></td></tr>}</Fragment>;})}</tbody></table></div>
    {pages>1&&<div className="df-candidate-pagination"><Button white disabled={currentPage===0} onClick={()=>{setPage(currentPage-1);setCandidateId(null);}}>Prethodna</Button><span>{currentPage*25+1}–{Math.min((currentPage+1)*25,candidates.length)} od {candidates.length}</span><Button white disabled={currentPage>=pages-1} onClick={()=>{setPage(currentPage+1);setCandidateId(null);}}>Sljedeća</Button></div>}
  </section>;
}
