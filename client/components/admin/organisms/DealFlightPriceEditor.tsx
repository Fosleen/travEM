"use client";
import {useState,type ReactNode} from 'react';
import {Check,X} from '@phosphor-icons/react';
import Button from '@/components/atoms/Button';
import AdvancedDropdown from '@/components/admin/atoms/AdvancedDropdown';
import {dealFinderAirlines} from '@/utils/dealFinderAirlines.mjs';
const options=[...dealFinderAirlines].sort((a,b)=>a.name.localeCompare(b.name,'hr'));
type PriceInput={priceEur:number,airlineCode:string|null,outboundAirlineCode?:string|null,inboundAirlineCode?:string|null,parking?:boolean,freeParking?:boolean,freeCancellation?:boolean,breakfast?:boolean};
type Props={busy:boolean,action:(fn:()=>Promise<void>)=>Promise<void>,onSave:(fields:PriceInput)=>Promise<void>,onCancel:()=>void,initialPrice?:number,initialCarrier?:string|null,initialOutboundCarrier?:string|null,initialInboundCarrier?:string|null,submitLabel?:string,kind?:'flight'|'hotel',initialParking?:boolean,initialFreeParking?:boolean,initialFreeCancellation?:boolean,initialBreakfast?:boolean,disabled?:boolean,children?:ReactNode};
export default function DealFlightPriceEditor({busy,action,onSave,onCancel,initialPrice,initialCarrier,initialOutboundCarrier,initialInboundCarrier,submitLabel='Spremi cijenu',kind='flight',initialParking=false,initialFreeParking=false,initialFreeCancellation=false,initialBreakfast=false,disabled=false,children}:Props){
  const [priceEur,setPriceEur]=useState(initialPrice===undefined?'':String(initialPrice)),[airlineCode,setAirlineCode]=useState(initialOutboundCarrier||initialCarrier||'');
  const [inboundAirlineCode,setInboundAirlineCode]=useState(initialInboundCarrier||'');
  const [differentCarrier,setDifferentCarrier]=useState(Boolean(initialInboundCarrier&&initialOutboundCarrier&&initialInboundCarrier!==initialOutboundCarrier));
  const [parking,setParking]=useState(initialParking||initialFreeParking),[freeParking,setFreeParking]=useState(initialFreeParking);
  const [freeCancellation,setFreeCancellation]=useState(initialFreeCancellation);
  const [breakfast,setBreakfast]=useState(initialBreakfast);
  const valid=!disabled&&Number.isFinite(Number(priceEur))&&Number(priceEur)>0&&(kind!=='flight'||!differentCarrier||Boolean(airlineCode&&inboundAirlineCode&&airlineCode!==inboundAirlineCode));
  return <form className={`df-candidate-editor ${kind==='hotel'?'df-hotel-price-editor':''}`} onSubmit={e=>{e.preventDefault();if(!valid||busy)return;void action(async()=>{await onSave({priceEur:Number(priceEur),airlineCode:differentCarrier?null:airlineCode||null,...(kind==='hotel'?{parking,freeParking,freeCancellation,breakfast}:{outboundAirlineCode:airlineCode||null,inboundAirlineCode:(differentCarrier?inboundAirlineCode:airlineCode)||null})});onCancel();});}}>
    <div className="df-candidate-editor-heading"><div><strong>Provjerena cijena</strong><small>{kind==='hotel'?'Upiši ukupnu cijenu cijelog boravka za dvije osobe, sa svim naknadama.':'Upiši povratnu cijenu koju si pronašao/la na Skyscanneru.'}</small></div><button type="button" className="df-dismiss-button" disabled={busy} onClick={onCancel} aria-label="Odustani od uređivanja cijene"><X size={18}/></button></div>
    {children}
    <fieldset disabled={busy} className="df-candidate-fields"><label>{kind==='hotel'?'Ukupno za boravak':'Ukupno povratno po osobi'}<div className="df-price-input"><input aria-label={kind==='hotel'?'Provjerena ukupna cijena boravka u eurima':'Provjerena povratna cijena u eurima'} autoFocus type="number" inputMode="decimal" min={0.01} step={0.01} placeholder="0,00" required value={priceEur} onChange={e=>setPriceEur(e.target.value)}/><span>€</span></div></label>
      {kind==='flight'&&<AdvancedDropdown label={differentCarrier?'Prijevoznik na odlasku':'Prijevoznik (opcionalno)'} hardcodedValue="Pretraži prijevoznike" options={options} selectedValue={airlineCode||null} filter filterInputAutoFocus appendTo="self" isDisabled={busy} onChange={(option:unknown)=>setAirlineCode((option as {id?:string}|null)?.id||'')}/>}
      <Button type="submit" adminPrimary disabled={busy||!valid}><Check size={17}/>{submitLabel}</Button>
      {kind==='flight'&&<div className="df-direction-carriers"><label className="df-option-check"><input type="checkbox" checked={differentCarrier} onChange={e=>setDifferentCarrier(e.target.checked)}/>Drugi prijevoznik na povratnom letu</label>{differentCarrier&&<AdvancedDropdown label="Prijevoznik na povratku" hardcodedValue="Pretraži prijevoznike" options={options} selectedValue={inboundAirlineCode||null} filter filterInputAutoFocus appendTo="self" isDisabled={busy} onChange={(option:unknown)=>setInboundAirlineCode((option as {id?:string}|null)?.id||'')}/>}</div>}
      {kind==='hotel'&&<div className="df-hotel-parking-options"><label className="df-option-check"><input type="checkbox" checked={breakfast} onChange={e=>setBreakfast(e.target.checked)}/>Uključen doručak</label><label className="df-option-check"><input type="checkbox" checked={freeCancellation} onChange={e=>setFreeCancellation(e.target.checked)}/>Besplatno otkazivanje</label><label className="df-option-check"><input type="checkbox" checked={parking} onChange={e=>{setParking(e.target.checked);if(!e.target.checked)setFreeParking(false);}}/>Parking</label><label className="df-option-check"><input type="checkbox" checked={freeParking} onChange={e=>{setFreeParking(e.target.checked);if(e.target.checked)setParking(true);}}/>Besplatan parking</label></div>}
    </fieldset>
  </form>;
}
