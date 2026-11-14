"use client";
import {Fragment,useCallback,useEffect,useRef,useState, type ReactNode} from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Button from '@/components/atoms/Button';
import ToggleSwitch from '@/components/admin/atoms/ToggleSwitch';
import {AirplaneTilt,ArrowRight,ArrowClockwise,CalendarBlank,CheckCircle,ClockCounterClockwise,Info,MagnifyingGlass,MapPin,Plus,ShieldCheck,SlidersHorizontal,Tray,WarningCircle,X} from '@phosphor-icons/react';
import CountryFlag from '@/components/admin/atoms/CountryFlag';
import {dealFinderApi as api} from '@/utils/dealFinder';
import DealOfferDetail from '@/components/admin/organisms/DealOfferDetail';
import DealAirportSearch, {type FlightDestination} from '@/components/admin/organisms/DealAirportSearch';
import DealPexelsReminder from '@/components/admin/organisms/DealPexelsReminder';
import {defaultSearchWindow,changeSearchStart,nextSearchDate,searchWindowDays} from '@/utils/dealFinderSearch.mjs';
import {offerSummary,sortOffers} from '@/utils/dealFinderOffers.mjs';
import AirlineBadge from '@/components/admin/atoms/AirlineBadge';
import FlightStopsBadge from '@/components/admin/atoms/FlightStopsBadge';
import './style.scss';
type Json = Record<string, any>; // Provider independent admin JSON is validated on the server.
const statusLabels:Record<string,string>={manual:'Ručno',scheduled:'Automatski',queued:'Na čekanju',running:'U tijeku',completed:'Dovršeno',failed:'Neuspješno',discovered:'Pronađeno',needs_verification:'Za provjeru',ready_for_selection:'Odabrano',draft:'Nacrt',published:'Objavljeno',rejected:'Odbačeno',expired:'Isteklo',verified:'Provjereno',unverified:'Nepotvrđeno',stale:'Provjera je istekla',unavailable:'Nedostupno'};
const label=(value:string)=>statusLabels[value]||value;
const tabs=[{name:'Ponude',icon:Tray},{name:'Nova pretraga',icon:MagnifyingGlass},{name:'Postavke',icon:SlidersHorizontal},{name:'Povijest',icon:ClockCounterClockwise}];
function ActionButton({label:children,onClick,disabled,outlined,severity,icon}:{label:string,onClick?:()=>void,disabled?:boolean,outlined?:boolean,severity?:string,icon?:ReactNode}) {
  return <Button onClick={onClick} disabled={disabled} adminPrimary={!outlined&&severity!=='secondary'} white={outlined||severity==='secondary'}>{icon}{children}</Button>;
}
const localDate=(value:string)=>new Date(value).toLocaleString('hr-HR',{dateStyle:'medium',timeStyle:'short'});
const offerPriceFormatter=new Intl.NumberFormat('hr-HR',{style:'currency',currency:'EUR',minimumFractionDigits:0,maximumFractionDigits:2});
function OfferPrice({summary}:{summary:ReturnType<typeof offerSummary>}) {
  const {cheapest,cheapestFlight}=summary;
  return <span className="df-card-fare"><span className="df-card-price">{Number.isFinite(cheapest)?`Od ${offerPriceFormatter.format(cheapest/100)}`:'Cijena nije dostupna'}</span>{cheapestFlight&&<><AirlineBadge flight={cheapestFlight}/><FlightStopsBadge flight={cheapestFlight}/></>}</span>;
}
function OfferBadges({offer,weekend}:{offer:Json,weekend:number}) {
  return <div className="df-offer-badges">{offer.data?.type==='roundup'&&<span className="df-badge">Više odredišta</span>}{!['needs_verification','discovered','unverified'].includes(offer.status)&&<span className={`df-badge status-${offer.status}`}>{label(offer.status)}</span>}{offer.outsideEurope===true&&<span className="df-badge df-badge-distant">{offer.data?.type==='roundup'?'Uključuje izvan Europe':'Izvan Europe'}</span>}{weekend<2&&<span className="df-badge df-badge-weekend">{weekend===0?'Weekend break':'Produženi vikend'}</span>}</div>;
}
function OfferCity({name,code,airportName,country}:{name:string,code:string,airportName?:string,country?:string}) {
  const element=useRef<HTMLElement>(null);
  useEffect(()=>{
    const target=element.current;if(!target)return;
    const context=document.createElement('canvas').getContext('2d');if(!context)return;
    const fit=()=>{
      if(!target.isConnected)return;
      const style=getComputedStyle(target);context.font=`${style.fontWeight} 20px ${style.fontFamily}`;
      const longest=Math.max(1,...name.split(/\s+/).map(word=>context.measureText(word).width));
      target.style.fontSize=`${Math.min(20,Math.max(1,(target.clientWidth-2)/longest*20))}px`;
    };
    const observer=new ResizeObserver(fit);observer.observe(target);fit();
    let active=true;document.fonts.ready.then(()=>{if(active)fit();});
    return()=>{active=false;observer.disconnect();};
  },[name]);
  return <strong ref={element} title={airportName}><span className="df-city-label">{name.split(/\s+/).map((word,i)=><Fragment key={i}>{i>0?' ':''}<span className="df-city-word">{word}</span></Fragment>)}</span><small><CountryFlag country={country}/> ({code})</small></strong>;
}
export default function DealFinder() {
  const [offerSort,setOfferSort]=useState('price');
  const [tab,setTab]=useState('Ponude'),[offers,setOffers]=useState<Json[]>([]),[runs,setRuns]=useState<Json[]>([]),[origins,setOrigins]=useState<Json[]>([]),[budget,setBudget]=useState<Json>({}),[settings,setSettings]=useState(''),[error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[offer,setOffer]=useState<Json|null>(null),[filter,setFilter]=useState('');
  const [search,setSearch]=useState<Json>(()=>({...defaultSearchWindow(),origins:[],minimumDays:1,mode:'discover',discoveryStrategy:'cheap_first',maxPriceEur:100,combineDestinations:false}));
  const [destination,setDestination]=useState<FlightDestination|null>(null);
  const reload=useCallback(async()=>{
    const [o,r,a,b]=await Promise.all([api('/offers'),api('/runs'),api('/origins'),api('/budget')]);setOffers(o);setRuns(r);setOrigins(a);setBudget(b);
  },[]);
  const action=useCallback(async(fn:()=>Promise<void>)=>{setBusy(true);setError('');setNotice('');try{await fn();}catch(e){const message=e instanceof Error?e.message:'Pogreška';setError(/doesn't exist|no such table|unknown column|unknown database/i.test(message)?'Baza još nije pripremljena za Deal Finder. Prvo pokrenite potrebne SQL migracije; pretrage nisu pokrenute.':message);}finally{setBusy(false);}},[]);
  useEffect(()=>{action(async()=>{await reload();setSettings(JSON.stringify(await api('/settings'),null,2));});},[action,reload]);
  useEffect(()=>{if(!runs.some(r=>['queued','running'].includes(r.status)))return;const timer=setInterval(()=>reload().catch(()=>{}),3000);return()=>clearInterval(timer);},[runs,reload]);
  const config:Json=settings?JSON.parse(settings):{};
  const setConfig=(key:string,value:unknown)=>setSettings(JSON.stringify({...config,[key]:value},null,2));
  const visibleOffers=sortOffers(offers.filter(o=>`${o.origin} ${o.originName} ${o.destination} ${o.destinationName} ${o.destinations?.map((d:Json)=>`${d.name} ${d.code}`).join(' ')||''} ${label(o.source)} ${label(o.status)}`.toLowerCase().includes(filter.toLowerCase())),offerSort);
  const windowDays=searchWindowDays(search.start,search.end);
  const validSearch=Number.isInteger(windowDays)&&Number.isInteger(search.minimumDays)&&search.minimumDays>=1&&windowDays>=search.minimumDays&&(search.mode!=='discover'||search.discoveryStrategy!=='price_limit'||(Number.isInteger(search.maxPriceEur)&&search.maxPriceEur>=1&&search.maxPriceEur<=100000));
  const plannedQueries=validSearch?search.origins.length*(search.mode==='route'?(windowDays-search.minimumDays+1)*(destination?.airports?.length||1):search.discoveryStrategy==='cheap_first'?2:1):0;
  const overLimit=plannedQueries>Number(config.maxQueries??10)||plannedQueries>Number(budget.remaining??0);
  async function dismiss(id:number) {await api(`/offers/${id}/dismiss`,{});await reload();setNotice('Ponuda je trajno obrisana.');}
  async function deleteAll() {
    const result=await Swal.fire({title:'Obrisati sve ponude?',text:'Trajno će se obrisati sve Deal Finder ponude, uključujući one izvan trenutačnog filtera. Povezani CMS članci ostaju sačuvani. Brisanje nije moguće poništiti.',icon:'warning',showCancelButton:true,confirmButtonColor:'#AC2B2B',cancelButtonColor:'#2BAC82',cancelButtonText:'Odustani',confirmButtonText:'Da, obriši sve',focusCancel:true});
    if(!result.isConfirmed)return;
    await action(async()=>{const result=await api('/offers/delete-all',{confirm:true});setOffer(null);await reload();setNotice(`Trajno obrisano ponuda: ${result.deleted}.`);});
  }
  async function open(id:number) {setOffer(await api(`/offers/${id}`));}
  return <main className="deal-finder" aria-busy={busy}>
    <DealPexelsReminder/>
    <header className="df-header"><div className="df-heading"><span className="df-heading__icon"><AirplaneTilt size={30}/></span><div><span className="df-eyebrow">PONUDE PUTOVANJA</span><h1>Deal Finder</h1><p>Pronađi dobru ponudu. Odaberi detalje. Pripremi članak.</p></div></div><ActionButton label="Nova pretraga" icon={<Plus size={19}/>} onClick={()=>{setOffer(null);setTab('Nova pretraga');}}/></header>
    <div className="df-overview"><article><span className="df-stat-icon"><Tray size={23}/></span><div><span>Ponude za pregled</span><strong>{offers.filter(o=>!['rejected','expired','published'].includes(o.status)).length}</strong></div></article><article><span className="df-stat-icon"><CheckCircle size={23}/></span><div><span>Odabrane ponude</span><strong>{offers.filter(o=>o.status==='ready_for_selection').length}</strong></div></article><article><span className="df-stat-icon"><MagnifyingGlass size={23}/></span><div><span>API upiti ovog mjeseca</span><strong>{budget.used??'—'} <small>/ {budget.limit??'—'}</small></strong></div></article><article><span className="df-stat-icon"><ShieldCheck size={23}/></span><div><span>Preostalo upita</span><strong>{budget.remaining??'—'}</strong></div></article></div>
    <nav className="df-tabs" aria-label="Deal Finder">{tabs.map(({name,icon:Icon})=><button type="button" key={name} className={tab===name?'is-active':''} aria-current={tab===name?'page':undefined} onClick={()=>setTab(name)}><Icon size={20}/>{name}</button>)}</nav>
    {error&&<div role="alert" className="df-alert error"><WarningCircle size={22}/><span>{error}</span></div>}{notice&&<div role="status" className="df-alert success"><CheckCircle size={22}/><span>{notice}</span></div>}
    {tab==='Nova pretraga'&&<section className="df-panel">
      <div className="df-panel-heading"><span className="df-section-icon"><MagnifyingGlass size={23}/></span><div><h2>Nova pretraga letova</h2><p>Odaberi polazišta i razdoblje putovanja.</p></div></div>
      <div className="df-search-layout"><div>
        <label>Način pretrage<select value={search.mode} onChange={e=>setSearch({...search,mode:e.target.value,combineDestinations:e.target.value==='discover'&&search.combineDestinations})}><option value="discover">Otkrivanje destinacija</option><option value="route">Ciljana pretraga grada ili aerodroma</option></select></label>
        {search.mode==='discover'&&<><ToggleSwitch name="df-combine-destinations" description="Spoji sva odredišta u jednu ponudu" value={search.combineDestinations===true} setter={(value:boolean)=>setSearch({...search,combineDestinations:value,origins:value?search.origins.slice(0,1):search.origins})}/>{search.combineDestinations&&<p>Jedno polazište, više odredišta za zajednički članak s povratnim letovima. Broj API upita ostaje isti.</p>}</>}
        {search.mode==='route'?<><DealAirportSearch value={destination} onChange={setDestination}/>{destination?.airports&&<p>Pretražujemo {destination.airports.length} aerodroma: {destination.airports.join(', ')}. Svaki aerodrom troši zasebne API upite; ukupan broj prikazan je prije pokretanja.</p>}</>:<p>Otkrivatelj vraća izdvojene ponude po destinacijama, često jedan termin. Za pregled više termina određene rute odaberi ciljanu pretragu.</p>}
        {search.mode==='discover'&&<label>Strategija otkrivanja<select value={search.discoveryStrategy} onChange={e=>setSearch({...search,discoveryStrategy:e.target.value})}><option value="cheap_first">Budget + izvan Europe · 2 upita po polazištu</option><option value="broad">Samo širi pregled · 1 upit po polazištu</option><option value="price_limit">Destinacije do određene cijene · 1 upit po polazištu</option></select></label>}
        {search.mode==='discover'&&search.discoveryStrategy==='price_limit'&&<label>Najviša cijena povratnog leta (€)<input type="number" min={1} max={100000} step={1} value={search.maxPriceEur} onChange={e=>setSearch({...search,maxPriceEur:Number(e.target.value)})}/><small>Za jednu osobu, neovisno o prijevozniku. Prikazuju se pronađene ponude do zadanog iznosa.</small></label>}
        {search.mode==='discover'&&search.discoveryStrategy==='cheap_first'&&<p>Prvi upit uključuje Ryanair i Wizz Air te Pegasus, Eurowings, easyJet, Voloteu, Vueling, Transaviju, Norwegian, airBaltic, Jet2 i FlyOne Armenia. Drugi traži povoljne destinacije izvan Europe. Ostale europske ponude se ne spremaju; cijene nemaju unaprijed zadani plafon.</p>}
        <fieldset className="df-origins"><legend>Aktivna polazišta</legend><div>{origins.map(a=><label key={a.code||a.id} className={search.origins.includes(a.code)?'is-selected':!a.code?'is-disabled':''}><input type={search.combineDestinations?'radio':'checkbox'} name="df-search-origin" disabled={!a.code} checked={search.origins.includes(a.code)} onChange={e=>setSearch({...search,origins:e.target.checked?(search.combineDestinations?[a.code]:[...search.origins,a.code]):search.origins.filter((c:string)=>c!==a.code)})}/><span><strong>{a.name}</strong><small>{a.code||'Nedostaje IATA kod'}</small></span></label>)}</div>{!origins.length&&<p>Popis polazišta još nije učitan.</p>}<Link href="/admin/uredi-aerodrome"><MapPin size={16}/>Uredi polazišta i IATA kodove<ArrowRight size={15}/></Link></fieldset>
        <div className="grid">
          <label>Od datuma<input type="date" value={search.start} onChange={e=>setSearch(changeSearchStart(search,e.target.value))}/></label>
          <label>Do datuma<input type="date" value={search.end} min={search.start?nextSearchDate(search.start):undefined} onChange={e=>setSearch({...search,end:e.target.value})}/></label>
          <label>Minimalno trajanje (dana)<input type="number" min={1} step={1} value={search.minimumDays} onChange={e=>setSearch({...search,minimumDays:Number(e.target.value)})}/></label>
        </div>
        <p>Polazak i povratak su unutar odabranog razdoblja. Trajanje nije fiksno; zadani minimum je jedan dan.</p>
        {!validSearch&&<p className="error" role="alert">Provjeri raspon datuma, minimalno trajanje i, ako je odabrana, najvišu cijenu.</p>}
      </div><aside className="df-search-summary"><span className="df-section-icon"><AirplaneTilt size={27}/></span><h3>Pregled pretrage</h3><dl>
        <div><dt>Polazišta</dt><dd>{search.origins.join(', ')||'Nisu odabrana'}</dd></div>
        {search.mode==='route'&&<div><dt>Odredište</dt><dd>{destination?`${destination.city} (${destination.code})`:'Nije odabrano'}</dd></div>}
        <div><dt>Razdoblje</dt><dd>{search.start} – {search.end}</dd></div>
        <div><dt>Minimalno trajanje</dt><dd>{search.minimumDays} d.</dd></div>
        <div><dt>Planirano API upita</dt><dd className="df-query-count">{plannedQueries}</dd></div>
      </dl><p><Info size={17}/>Letovi su uvijek za jednu osobu. Smještaj za dvije osobe tražiš nakon odabira ponude.</p>
      {search.mode==='route'&&<p>Kalendar provjerava svaki mogući datum polaska i povratke do kraja raspona. Svaki datum polaska za svaki par polazišnog i odredišnog aerodroma troši jedan upit. Prikazuje cijene po terminima koje provider vrati.</p>}
      {overLimit&&<p className="error" role="alert">Plan prelazi limit po pretrazi ili preostalu mjesečnu kvotu. Skrati raspon, odaberi manje polazišta ili prilagodi limit u Postavkama.</p>}
      <ActionButton disabled={busy||!search.origins.length||!validSearch||overLimit||(search.mode==='route'&&(!destination||(destination.airports||[destination.code]).some(code=>search.origins.includes(code))))} label={busy?'Pokretanje…':`Pretraži letove · ${plannedQueries} upita`} icon={<MagnifyingGlass size={19}/>} onClick={()=>action(async()=>{await api('/search',{...search,destination:search.mode==='route'?destination?.code:undefined,adults:1});await reload();setTab('Povijest');})}/>
      </aside></div>
    </section>}
    {tab==='Ponude'&&<section className="df-panel"><div className="df-panel-heading"><div><h2>Ponude za sljedeći članak</h2><p>Pregledaj rute, usporedi termine i izdvoji ono najbolje.</p></div><span className="df-badge">{visibleOffers.length} ponuda</span></div><div className="df-toolbar"><label className="df-filter"><MagnifyingGlass size={20}/><input type="search" aria-label="Pretraži ponude" placeholder="Polazište, destinacija ili status…" value={filter} onChange={e=>setFilter(e.target.value)}/></label><button className="df-text-button" type="button" disabled={busy} onClick={()=>action(reload)}><ArrowClockwise size={18}/> Osvježi</button>{tab==='Ponude'&&<Button red disabled={busy||!offers.length} onClick={deleteAll}>Obriši sve ponude</Button>}</div>
      <div className="df-offer-sort"><label>Sortiraj ponude<select value={offerSort} onChange={e=>setOfferSort(e.target.value)}><option value="price">Najjeftinije</option><option value="weekend">Weekend break</option><option value="value">Najpovoljnije prema prosjeku</option><option value="date">Najraniji polazak</option><option value="duration">Najkraće putovanje</option></select></label></div><div className="cards">{visibleOffers.map(o=>{const summary=offerSummary(o);return <article className="df-offer-card" key={o.id}><div className="df-card-top"><OfferBadges offer={o} weekend={summary.weekend}/><div className="df-card-source"><span>{label(o.source)}</span><button type="button" className="df-dismiss-button" disabled={busy} aria-label={`Trajno obriši ponudu ${o.origin} – ${o.destination}`} title="Trajno obriši ponudu" onClick={()=>action(()=>dismiss(o.id))}><X size={18}/></button></div></div><div className="df-route"><OfferCity name={o.originName||o.origin} code={o.origin} airportName={o.originAirportName} country={o.originCountry}/><span><AirplaneTilt size={22}/><i/></span><OfferCity name={o.destinationName||o.destination} code={o.destinations?.map((d:Json)=>d.code).join(', ')||o.destination} airportName={o.destinationAirportName} country={o.destinationCountry}/></div><div className="df-card-meta"><span><CalendarBlank size={17}/>{o.data.flights.length} termina</span><OfferPrice summary={summary}/></div><div className="df-card-actions"><ActionButton label="Pregledaj ponudu" icon={<ArrowRight size={18}/>} onClick={()=>action(()=>open(o.id))}/>{o.articleId&&<Link href={`/admin/clanci/uredi/${o.articleId}`}>Uredi nacrt <ArrowRight size={15}/></Link>}</div></article>;})}</div>
      {!visibleOffers.length&&<div className="df-empty"><span><Tray size={38} weight="duotone"/></span><h3>{filter?'Nema rezultata za ovu pretragu':'Još nema spremljenih ponuda'}</h3><p>{filter?'Pokušaj s drugim polazištem, destinacijom ili statusom.':'Pokreni pretragu iz odabranih polazišta za razdoblje koje te zanima.'}</p>{!filter&&<ActionButton label="Nova pretraga" outlined icon={<ArrowRight size={18}/>} onClick={()=>setTab('Nova pretraga')}/>}</div>}</section>}
    {tab==='Povijest'&&<section className="df-panel"><div className="df-panel-heading"><div><h2>Povijest pretraga</h2><p>Sva pokretanja, potrošnja upita i rezultati na jednom mjestu.</p></div><ActionButton label="Osvježi" outlined icon={<ArrowClockwise size={18}/>} onClick={()=>action(reload)}/></div>{runs.length?<div className="df-run-list">{runs.map(r=><article key={r.id}><span className="df-section-icon"><ClockCounterClockwise size={22}/></span><div><strong>Pretraga #{r.id} <span className={`df-badge status-${r.status}`}>{label(r.status)}</span></strong><p>{localDate(r.createdAt)} · {label(r.source)} · {r.input?.origins?.join(', ')}</p>{r.input?.progress?.results?.map((result:Json)=><p key={result.destination}>{result.destination}: {result.returned} {result.mode==='budget_dates'?'kombinacija':'termina'}{result.mode==='budget_dates'&&<> · datumi odlaska/povratka: {result.outboundDates}/{result.inboundDates}</>}</p>)}{r.error&&<p className="error" role="alert">{r.error}</p>}</div><span className="df-run-usage"><strong>{r.usage}</strong> API upita</span></article>)}</div>:<div className="df-empty"><span><ClockCounterClockwise size={38}/></span><h3>Još nema pokrenutih pretraga</h3><p>Kad pokreneš prvu pretragu, ovdje ćeš vidjeti njezin tijek i broj iskorištenih upita.</p></div>}</section>}
    {tab==='Postavke'&&<section className="df-panel">
      <div className="df-panel-heading"><div><h2>Postavke Deal Findera</h2><p>Budžet, kvaliteta smještaja i raspored pretraga.</p></div></div>
      <div className="df-settings-grid">
        <fieldset disabled={!settings}><legend><ShieldCheck size={20}/> Budžet pretraga</legend>
          {[['monthlyCap','Mjesečno ograničenje upita'],['reserve','Rezerva za pretrage izvan Deal Findera'],['maxQueries','Najviše upita po pretrazi']].map(([key,title])=><label key={key}>{title}<input type="number" min={key==='maxQueries'?1:0} max={key==='maxQueries'?30:250} value={config[key]??''} onChange={e=>setConfig(key,Number(e.target.value))}/></label>)}
          <p>Rezervu Deal Finder ne troši: ostaje za druge pretrage na istom SerpApi računu. Za korištenje cijele kvote postavi rezervu na 0 i mjesečno ograničenje na 250.</p>
        </fieldset>
        <fieldset disabled={!settings}><legend><CheckCircle size={20}/> Kvaliteta smještaja</legend>
          {[['minRating','Minimalna ocjena (0–10)'],['minReviews','Minimalan broj recenzija'],['cancellationBonus','Prednost besplatnog otkazivanja']].map(([key,title])=><label key={key}>{title}<input type="number" min={0} step={key==='minRating'?0.1:1} value={config[key]??''} onChange={e=>setConfig(key,Number(e.target.value))}/></label>)}
          <ToggleSwitch name="df-free-cancellation" description="Samo tarife s besplatnim otkazivanjem" value={config.freeCancellationOnly===true} setter={(v:boolean)=>setConfig('freeCancellationOnly',v)}/>
        </fieldset>
        <fieldset disabled={!settings}><legend><CalendarBlank size={20}/> Raspored pretraga</legend>
          <ToggleSwitch name="df-schedule" description="Uključi automatske pretrage" value={config.scheduleEnabled===true} setter={(v:boolean)=>setConfig('scheduleEnabled',v)}/>
          <label>Učestalost<select value={config.scheduleFrequency||'odd'} onChange={e=>setConfig('scheduleFrequency',e.target.value)}><option value="odd">Svaki neparni datum</option><option value="even">Svaki parni datum</option><option value="interval">Svakih X dana</option></select></label>
          {config.scheduleFrequency==='interval'&&<label>Svakih koliko dana?<input type="number" min={1} max={365} step={1} value={config.scheduleIntervalDays??2} onChange={e=>setConfig('scheduleIntervalDays',Number(e.target.value))}/></label>}
          <label>Vrijeme pretrage<input type="time" value={config.scheduleTime||'08:00'} onChange={e=>setConfig('scheduleTime',e.target.value)}/></label>
          <label>Polazišta po pokretanju<input type="number" min={1} max={12} value={config.originsPerRun??2} onChange={e=>setConfig('originsPerRun',Number(e.target.value))}/></label>
          <p>Vrijeme je prema Europe/Zagreb. Razmak u danima računa se od zadnje automatske pretrage.</p>
        </fieldset>
        <fieldset disabled={!settings}><legend>AI priprema članka</legend><p>Pokreće se samo ručno na koraku pripreme članka.</p><ToggleSwitch name="df-ai-enabled" description="Dopusti AI pripremu na izričit klik" value={config.aiEnabled===true} setter={(v:boolean)=>setConfig('aiEnabled',v)}/></fieldset>
        <fieldset disabled={!settings}><legend><MapPin size={20}/> Polazni aerodromi</legend><Link className="df-inline-link" href="/admin/uredi-aerodrome">Uredi aerodrome i IATA kodove <ArrowRight size={18}/></Link></fieldset>
      </div>
      <div className="df-panel-actions"><ActionButton label="Spremi postavke" disabled={busy||!settings} onClick={()=>action(async()=>{const saved=await api('/settings',JSON.parse(settings),'PUT');setSettings(JSON.stringify(saved));await reload();setNotice('Postavke su spremljene.');})}/></div>
    </section>}
    {offer&&<DealOfferDetail key={offer.id} offer={offer} busy={busy} error={error} notice={notice} action={action} onClose={()=>setOffer(null)} onRefresh={async()=>{await reload();setOffer(await api(`/offers/${offer.id}`));}}/>}
  </main>;
}
