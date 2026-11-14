"use client";
import {useEffect,useId,useState} from 'react';
import {MagnifyingGlass,X} from '@phosphor-icons/react';
import CountryFlag from '@/components/admin/atoms/CountryFlag';
import {dealFinderApi as api} from '@/utils/dealFinder';
export type FlightDestination={code:string,city:string,name:string,country:string,airports?:string[]};
type Airport=FlightDestination;
export default function DealAirportSearch({value,onChange}:{value:Airport|null,onChange:(airport:Airport|null)=>void}) {
  const [query,setQuery]=useState(''),[results,setResults]=useState<Airport[]>([]),[open,setOpen]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(''),[active,setActive]=useState(-1);
  const listId=useId();
  useEffect(()=>{
    if(!open||value||query.trim().length<2)return;
    let cancelled=false;
    const timer=setTimeout(()=>{setLoading(true);api(`/airports?includeCities=true&q=${encodeURIComponent(query.trim())}`).then(data=>{if(!cancelled)setResults(data);}).catch(()=>{if(!cancelled)setError('Popis gradova i aerodroma nije dostupan. Pokušaj ponovno.');}).finally(()=>{if(!cancelled)setLoading(false);});},200);
    return()=>{clearTimeout(timer);cancelled=true;};
  },[query,open,value]);
  const updateQuery=(text:string)=>{onChange(null);setQuery(text);setResults([]);setActive(-1);setError('');setLoading(false);setOpen(true);};
  const choose=(airport:Airport)=>{onChange(airport);setQuery('');setOpen(false);};
  return <div className="df-airport-search" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}}>
    <label htmlFor={listId+'-input'}>Odredišni grad ili aerodrom</label>
    <div className="df-airport-input">{value?<CountryFlag country={value.country}/>:<MagnifyingGlass size={20}/>}<input id={listId+'-input'} role="combobox" aria-autocomplete="list" aria-expanded={open&&!value} aria-controls={listId} aria-activedescendant={active>=0?`${listId}-${active}`:undefined} autoComplete="off" placeholder="Grad ili IATA kod, npr. London ili STN" value={value?`${value.city} - ${value.name} (${value.airports?.join(', ')||value.code})`:query} onFocus={()=>setOpen(true)} onChange={e=>updateQuery(e.target.value)} onKeyDown={e=>{
      if(e.key==='Escape'){setOpen(false);return;}
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setOpen(true);setActive(i=>e.key==='ArrowDown'?Math.min(i+1,results.length-1):Math.max(i-1,0));}
      if(e.key==='Enter'&&open&&results[active]){e.preventDefault();choose(results[active]);}
    }}/>{value&&<button type="button" className="df-dismiss-button" aria-label="Ukloni odredište" onClick={()=>updateQuery('')}><X size={16}/></button>}</div>
    {open&&!value&&<div className="df-airport-results"><ul id={listId} role="listbox" aria-label="Odredišni gradovi i aerodromi">{results.map((a,i)=><li key={a.code} id={`${listId}-${i}`} role="option" aria-selected={i===active} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(a)} className={i===active?'is-active':''}><strong><CountryFlag country={a.country}/> {a.city} ({a.airports?.join(', ')||a.code})</strong><span>{a.name} · {a.country}</span></li>)}</ul><p role="status">{loading?'Pretraživanje…':error||(!results.length?(query.trim().length<2?'Upiši barem dva znaka.':'Nema pronađenih gradova ili aerodroma.'):'')}</p></div>}
  </div>;
}
