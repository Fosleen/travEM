"use client";
import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import DOMPurify from 'dompurify';
import {AirplaneTilt,ArrowRight,ArrowClockwise,X} from '@phosphor-icons/react';
import Button from '@/components/atoms/Button';
import DealRouteSearch from './DealRouteSearch';
import DealBatchRouteSearch from './DealBatchRouteSearch';
import DealFlightTable from './DealFlightTable';
import DealFlightPriceEditor from './DealFlightPriceEditor';
import DealEditorialChoice from './DealEditorialChoice';
import DealArticleSectionEditor from './DealArticleSectionEditor';
import {storeDealArticlePrefill} from '@/utils/dealArticlePrefill.mjs';


import CountryFlag from '@/components/admin/atoms/CountryFlag';
import {dealFinderApi as api, type DealJson} from '@/utils/dealFinder';
import {formatFlightDate,tripNights} from '@/utils/dealFinderFlights.mjs';
import {hotelDisplayPrice,hotelFeatures,recommendedHotelIndex,sortHotelOptions,toggleHotelSelection,hotelType,hotelTypeOptions,filterHotelTypes} from '@/utils/dealFinderHotels.mjs';
import './DealOfferDetail.scss';

type Props={offer:DealJson,busy:boolean,onClose:()=>void,onRefresh:()=>Promise<void>,action:(fn:()=>Promise<void>)=>Promise<void>,error:string,notice:string};
const priceFormatter=new Intl.NumberFormat('hr-HR',{style:'currency',currency:'EUR'});
const price=(cents:number)=>priceFormatter.format(cents/100);
const editorHtml=(value:string)=>String(value||'').split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${p.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))}</p>`).join('');

export default function DealOfferDetail({offer,busy,onClose,onRefresh,action,error,notice}:Props) {
  const router=useRouter(),dialog=useRef<HTMLDialogElement>(null);
  const flights:DealJson[]=offer.data.flights,hotels:DealJson[]=offer.data.hotels;
  const roundup=offer.data.type==='roundup';
  const [step,setStep]=useState(0);
  const [selected,setSelected]=useState<number[]>(offer.selection?.flightIndices||[]);
  const [hotelIndex,setHotelIndex]=useState<number|null>(offer.selection?.hotelIndex??null);
  const [extraHotels,setExtraHotels]=useState<number[]>(offer.selection?.extraHotelIndices||[]);
  const [hotelSort,setHotelSort]=useState('recommended'),[editingHotel,setEditingHotel]=useState<number|null>(null);
  const [excludedHotelTypes,setExcludedHotelTypes]=useState<string[]>([]);
  const [example,setExample]=useState<number|null>(offer.selection?.flightIndices?.[offer.selection?.exampleIndex||0]??null);
  const [checkin,setCheckin]=useState(offer.selection?.checkin||'');
  const [checkout,setCheckout]=useState(offer.selection?.checkout||'');
  const adults=2;
  const [rooms,setRooms]=useState(hotels[offer.selection?.hotelIndex]?.rooms||1);
  const [showAllHotels,setShowAllHotels]=useState(false),[preview,setPreview]=useState('');
  const [hotelRun,setHotelRun]=useState<number|null>(null),[hotelMessage,setHotelMessage]=useState(''),[selectionSaved,setSelectionSaved]=useState(false);
  const [hostelUrl,setHostelUrl]=useState(offer.selection?.hostel?.url||'');
  const [hostelPrice,setHostelPrice]=useState(String(offer.selection?.hostel?.totalEur||''));
  const [hostelRoom,setHostelRoom]=useState(offer.selection?.hostel?.roomType||'private_room');
  const [hostelBathroom,setHostelBathroom]=useState(offer.selection?.hostel?.bathroom||'unknown');
  const [hostelAmenities,setHostelAmenities]=useState<Record<string,boolean>>({freeCancellation:offer.selection?.hostel?.freeCancellation===true,breakfast:offer.selection?.hostel?.breakfast===true,kitchen:offer.selection?.hostel?.kitchen===true,lockers:offer.selection?.hostel?.lockers===true});
  const [title,setTitle]=useState(offer.provenance?.editorInput?.title??offer.provenance?.editorialDraft?.suggestions?.titles?.[0]??'');
  const [subtitle,setSubtitle]=useState(offer.provenance?.editorInput?.subtitle??offer.provenance?.editorialDraft?.suggestions?.subtitle??'');
  const [description,setDescription]=useState(offer.provenance?.editorInput?.description??offer.provenance?.editorialDraft?.suggestions?.descriptions?.[0]??'');
  const [intro,setIntro]=useState(editorHtml(offer.provenance?.editorInput?.intro??offer.provenance?.editorialDraft?.suggestions?.intro??''));
  const [introEdited,setIntroEdited]=useState(Boolean(offer.provenance?.editorInput?.intro));
  const [tags,setTags]=useState(offer.provenance?.editorInput?.tags??offer.provenance?.editorialDraft?.suggestions?.tags??'');
  const [sections,setSections]=useState<DealJson[]>((offer.provenance?.editorInput?.sections||offer.provenance?.editorialDraft?.suggestions?.sections||[]).map((section:DealJson)=>({...section,text:section.format==='html'?section.text:editorHtml(section.text),originalHtml:editorHtml(section.text),complete:section.format==='html',format:'html'})));
  const [sectionsEdited,setSectionsEdited]=useState(Boolean(offer.provenance?.editorInput?.sections));
  const [flightsOnly,setFlightsOnly]=useState(roundup||offer.selection?.flightsOnly===true);
  const [suggestions,setSuggestions]=useState<DealJson|null>(offer.provenance?.editorialDraft?.suggestions||null);
  const [buildProvider,setBuildProvider]=useState('template'),[buildMessage,setBuildMessage]=useState('');
  const cheapestSelected=selected.slice().sort((a,b)=>flights[a].priceCents-flights[b].priceCents)[0]??null;
  const exampleIndex=example!==null&&selected.includes(example)?example:cheapestSelected;
  const exampleFlight=exampleIndex===null?null:flights[exampleIndex];
  const stayStart=checkin||exampleFlight?.arrivalDate||exampleFlight?.departureDate||'';
  const stayEnd=checkout||exampleFlight?.returnLocalDate||exampleFlight?.returnDate||'';
  const compatible=(i:number)=>Boolean(hotels[i]&&hotels[i].checkin===stayStart&&hotels[i].checkout===stayEnd&&hotels[i].adults===adults&&(hotels[i].rooms||1)===rooms&&hotels[i].available!==false);
  const matchingHotels:number[]=offer.hotelRanking.filter(compatible);
  const hotelTypes=hotelTypeOptions(hotels,matchingHotels);
  const filteredHotels=filterHotelTypes(hotels,matchingHotels,excludedHotelTypes);
  const recommendedHotel=recommendedHotelIndex(hotels,filteredHotels);
  const eligibleHotels:number[]=sortHotelOptions(hotels,filteredHotels,hotelSort);
  const currentHotelSelection=[hotelIndex,...extraHotels].filter((i):i is number=>i!==null&&compatible(i));
  const primary=hotelIndex!==null&&compatible(hotelIndex)?hotels[hotelIndex]:null;
  const descriptionValid=description.trim().length>0&&description.length<=100;
  const selectionValid=selected.length>0&&(flightsOnly||primary);

  useEffect(()=>{
    const node=dialog.current;if(!node)return;
    node.showModal();const previous=document.body.style.overflow;document.body.style.overflow='hidden';
    return()=>{node.close();document.body.style.overflow=previous;};
  },[]);
  useEffect(()=>{
    if(hotelRun===null)return;
    let cancelled=false;
    const timer=setInterval(async()=>{
      try {
        const run=await api(`/runs/${hotelRun}`);if(cancelled)return;
        if(run?.status==='completed'){setHotelRun(null);setHotelMessage('Hotelski rezultati su učitani. Odaberi glavni smještaj.');await onRefresh();}
        else if(run?.status==='failed'){setHotelRun(null);setHotelMessage(run.error||'Hotelska pretraga nije uspjela.');}
      }catch{if(!cancelled){setHotelRun(null);setHotelMessage('Status nije dostupan. Rezultate možeš osvježiti ručno.');}}
    },3000);
    return()=>{cancelled=true;clearInterval(timer);};
  },[hotelRun,onRefresh]);
  function changeExample(value:number) {
    setExample(value);setCheckin(flights[value].arrivalDate||flights[value].departureDate);setCheckout(flights[value].returnLocalDate||flights[value].returnDate);
    setHotelIndex(null);setExtraHotels([]);setPreview('');
    setSelectionSaved(false);
  }
  function toggleFlight(index:number,checked:boolean) {
    const next=checked?[...selected,index]:selected.filter(i=>i!==index);
    const keepExplicit=example!==null&&next.includes(example);
    const nextExample=keepExplicit?example:next.slice().sort((a,b)=>flights[a].priceCents-flights[b].priceCents)[0]??null;
    if(!keepExplicit)setExample(null);
    if(nextExample!==exampleIndex) {
      setCheckin(nextExample===null?'':flights[nextExample].arrivalDate||flights[nextExample].departureDate);
      setCheckout(nextExample===null?'':flights[nextExample].returnLocalDate||flights[nextExample].returnDate);
      setHotelIndex(null);setExtraHotels([]);
    }
    setSelected(next);setPreview('');setSelectionSaved(false);
  }
  function toggleHotel(index:number){
    const next=toggleHotelSelection(currentHotelSelection,index);
    setHotelIndex(next[0]??null);setExtraHotels(next.slice(1));setSelectionSaved(false);setPreview('');
  }
  async function saveSelection() {
    if(!selectionValid||exampleIndex===null)throw new Error('Odaberi termine i glavni smještaj ili članak samo s letovima.');
    if(!flightsOnly&&hostelUrl&&(!Number.isFinite(Number(hostelPrice))||Number(hostelPrice)<=0))throw new Error('Upiši ukupnu cijenu hostelskog boravka za dvije osobe.');
    await api(`/offers/${offer.id}/select`,{
      template:roundup?'roundup':'route',flightIndices:[exampleIndex,...selected.filter(i=>i!==exampleIndex)],exampleIndex:0,
      flightsOnly,hotelIndex:flightsOnly?null:hotelIndex,extraHotelIndices:flightsOnly?[]:extraHotels.filter(i=>i!==hotelIndex&&compatible(i)),
      checkin:stayStart,checkout:stayEnd,
      hostel:!flightsOnly&&hostelUrl?{url:hostelUrl,totalEur:Number(hostelPrice),adults:2,checkin:stayStart,checkout:stayEnd,roomType:hostelRoom,bathroom:hostelBathroom,...hostelAmenities}:null,
    });
    await onRefresh();
    setSelectionSaved(true);
  }
  async function openEditor() {
    await saveSelection();
    const result=await api(`/offers/${offer.id}/article-form`,{fields:{title,subtitle,description,tags}});
    result.values.sections=result.values.sections.map((section:DealJson)=>{
      const edited=sections.find(s=>s.kind===section.kind);
      const original=edited?.originalHtml||'';
      const remainder=original&&section.section_text.startsWith(original)?section.section_text.slice(original.length):section.section_text;
      let body=edited?(edited.complete?edited.text:edited.text+remainder):section.section_text;
      if(section.required_notes&&!body.includes(section.notes_marker))body+=section.required_notes;
      const link=edited?.link_url??section.section_url_link;
      const images=edited?.images?.length?edited.images:section.section_images||[];
      if(link&&!/^https?:\/\//i.test(link))throw new Error('Poveznica odlomka mora počinjati s https:// ili http://');
      return {...section,section_images:images.filter((image:DealJson)=>image.include!==false).map((image:DealJson)=>({url:image.url})),section_text:DOMPurify.sanitize(section.kind==='intro'?intro:body),
        ...(edited?{section_subtitle:edited.subtitle,section_icon:edited.sectionIconId,section_url_title:edited.link_title??section.section_url_title,section_url_link:edited.link_url??section.section_url_link}:{})};
    });
    const token=storeDealArticlePrefill(sessionStorage,result,crypto.randomUUID());
    router.push(`/admin/clanci/dodaj?dealFinder=${token}`);
  }
  async function prepareContent() {
    await saveSelection();
    const result=await api(`/offers/${offer.id}/build-content`,{provider:buildProvider,confirmedAiRequest:buildProvider==='ai'});
    const text=result.suggestions;setSuggestions(text);
    setTitle((value:string)=>!value||suggestions?.titles?.includes(value)?text.titles[0]:value);
    setSubtitle((value:string)=>!value||suggestions?.subtitles?.includes(value)?text.subtitle:value);
    setDescription((value:string)=>!value||suggestions?.descriptions?.includes(value)?text.descriptions[0]:value);
    if(!introEdited)setIntro(result.editorSections?.find((section:DealJson)=>section.kind==='intro')?.text||editorHtml(text.intro));setTags((value:string)=>!value||value===suggestions?.tags?text.tags:value);
    if(!sectionsEdited)setSections((result.editorSections||[]).filter((section:DealJson)=>section.kind!=='intro').map((section:DealJson)=>({...section,format:'html',complete:true})));
    setBuildMessage('Prijedlozi su pripremljeni. Vlastiti tekst je sačuvan.'+(text.warnings?.length?' Pojedini neispravni AI prijedlozi zamijenjeni su prijedlozima iz potvrđenih podataka, bez dodatnog API poziva.':''));
  }
  function changeStep(value:number){setStep(value);dialog.current?.scrollTo({top:0,behavior:'smooth'});}
  return <dialog ref={dialog} className="df-dialog" aria-labelledby="df-detail-title" onCancel={onClose}><section className="detail">
    <header className="df-detail-header"><div><span className="df-eyebrow">DETALJ PONUDE</span><h2 id="df-detail-title"><span>{offer.originName||offer.origin}<small><CountryFlag country={offer.originCountry}/> ({offer.origin})</small></span><AirplaneTilt size={24}/><span>{offer.destinationName||offer.destination}<small>{roundup?offer.destinations?.map((d:DealJson)=>d.code).join(', '):<><CountryFlag country={offer.destinationCountry}/> ({offer.destination})</>}</small></span></h2></div><button type="button" aria-label="Zatvori detalj" onClick={onClose}><X size={23}/></button></header>
    {error&&<p className="df-alert error" role="alert">{error}</p>}{notice&&<p className="df-alert success" role="status">{notice}</p>}
    <nav className="df-detail-steps" aria-label="Priprema ponude">{['Termini letova','Smještaj','Članak'].map((name,index)=><button type="button" key={name} disabled={roundup&&index===1} aria-current={step===index?'step':undefined} className={step===index?'is-active':''} onClick={()=>changeStep(index)}><span>{index+1}</span><strong>{name}</strong><small>{index===0?`${selected.length} odabrano`:index===1?primary?'Odabrano':'Odaberi boravak':title.trim()?'Radni tekst':'Pripremi sadržaj'}</small></button>)}</nav>
    <section className="df-detail-step" hidden={step!==0} aria-label="Termini letova">
    <h3><span>1</span>Odaberi termine<small>{selected.length} odabrano</small></h3>
    {roundup?<DealBatchRouteSearch offer={offer} busy={busy} action={action} onComplete={async()=>{setSelectionSaved(false);setPreview('');await onRefresh();}}/>:<DealRouteSearch offer={offer} busy={busy} action={action} onComplete={async()=>{setSelectionSaved(false);setPreview('');await onRefresh();}}/>}
    <DealFlightTable offer={offer} selected={selected} busy={busy} action={action} onToggle={toggleFlight} onConfirmed={async index=>{await onRefresh();if(example===null&&cheapestSelected!==null)setExample(cheapestSelected);setSelected(previous=>previous.includes(index)?previous:[...previous,index]);setSelectionSaved(false);setPreview('');}} onUpdated={async()=>{setSelectionSaved(false);setPreview('');await onRefresh();}}/>
    </section>
    <section className="df-detail-step" hidden={step!==1} aria-label="Smještaj">
    <h3><span>2</span>Odaberi smještaj</h3>
    <label className="df-flight-only"><input type="checkbox" checked={flightsOnly} disabled={roundup} onChange={e=>{setFlightsOnly(e.target.checked);setSelectionSaved(false);}}/>Članak samo s letovima, bez smještaja</label>
    {roundup&&<p>Ova objedinjena ponuda priprema pregled povratnih letova za više odredišta. Za paket leta i smještaja koristi pojedinačnu ponudu.</p>}
    {!flightsOnly&&<>
    <p>Glavni termin i njegov smještaj određuju paketnu cijenu u naslovu. Ostali odabrani letovi ostaju u popisu termina.</p>
    <label>Glavni termin članka i smještaja<select disabled={!selected.length} value={exampleIndex??''} onChange={e=>changeExample(Number(e.target.value))}><option value="" disabled>Prvo odaberi letove</option>{selected.slice().sort((a,b)=>flights[a].priceCents-flights[b].priceCents).map(i=><option key={i} value={i}>{formatFlightDate(flights[i].departureDate)} – {formatFlightDate(flights[i].returnDate)} · {price(flights[i].priceCents)}{i===cheapestSelected?' · najjeftiniji odabrani':''}</option>)}</select></label>
    <p>Smještaj se uvijek traži za dvije odrasle osobe.</p>
    <div className="grid"><label>Lokalni dolazak / check-in<input type="date" value={stayStart} disabled={!exampleFlight} onChange={e=>{setCheckin(e.target.value);setHotelIndex(null);}}/></label><label>Lokalni odlazak / check-out<input type="date" value={stayEnd} disabled={!exampleFlight} onChange={e=>{setCheckout(e.target.value);setHotelIndex(null);}}/></label><label>Sobe<input type="number" min={1} max={4} value={rooms} onChange={e=>{setRooms(Number(e.target.value));setHotelIndex(null);}}/></label></div>
    <p>Ako let stiže sljedeći dan, prilagodi lokalne datume. Promjena termina sama ne pokreće novu hotelsku pretragu.</p>
    <Button white disabled={busy||!exampleFlight||hotelRun!==null} onClick={()=>action(async()=>{setHotelIndex(null);setExtraHotels([]);setSelectionSaved(false);const run=await api('/search',{mode:'hotels',offerId:offer.id,origins:[offer.origin],destination:offer.destination,place:offer.destinationName||offer.destination,start:exampleFlight!.departureDate,end:exampleFlight!.returnDate,days:tripNights(exampleFlight as {departureDate:string,returnDate:string,priceCents:number}),adults,rooms,checkin:stayStart,checkout:stayEnd});setHotelRun(run.id);setHotelMessage('Hotelska pretraga je pokrenuta. Rezultati će se osvježiti kad završi.');})}>Pretraži smještaj za ovaj termin · 1 API upit</Button>
    {hotelMessage&&<p role="status">{hotelMessage}</p>}
    <Button white disabled={busy} onClick={()=>action(onRefresh)}><ArrowClockwise size={17}/>Osvježi hotelske rezultate</Button>
    <div className="df-hotel-toolbar"><div><strong>{currentHotelSelection.length} odabrano</strong><small>Prvi odabrani smještaj je glavni, ostali ulaze u članak kao alternative.</small></div>{hotelTypes.length>0&&<div className="df-hotel-type-filters" role="group" aria-label="Tip smještaja"><span>Tip smještaja</span>{hotelTypes.map(type=><label key={type.key}><input type="checkbox" checked={!excludedHotelTypes.includes(type.key)} onChange={e=>{setExcludedHotelTypes(current=>e.target.checked?current.filter(key=>key!==type.key):[...current,type.key]);setShowAllHotels(false);}}/>{type.label} <small>({type.count})</small></label>)}</div>}<label>Sortiraj smještaje<select value={hotelSort} onChange={e=>setHotelSort(e.target.value)}><option value="recommended">Preporučeno</option><option value="price">Najniža cijena</option><option value="rating">Najviša ocjena</option><option value="cancellation">Besplatno otkazivanje</option><option value="breakfast">Uključen doručak</option><option value="parking">Parking</option></select></label></div>
    <div className="df-hotel-table-scroll"><table className="df-hotel-table df-hotel-selection"><caption className="df-sr-only">Smještaji za odabrane datume i goste</caption><thead><tr><th scope="col">Odabir</th><th scope="col">Smještaj</th><th scope="col">Ocjena</th><th scope="col">Cijena boravka</th></tr></thead><tbody>{eligibleHotels.slice(0,showAllHotels?eligibleHotels.length:5).map(i=>{const h=hotels[i],display=hotelDisplayPrice(h),features=hotelFeatures(h),checked=currentHotelSelection.includes(i);return <tr key={i} className={checked?'is-selected':''} onClick={()=>toggleHotel(i)}><td><input type="checkbox" aria-label={`Odaberi ${h.name}`} checked={checked} onClick={e=>e.stopPropagation()} onChange={()=>toggleHotel(i)}/></td><td><strong>{h.name}</strong><small>{hotelType(h).label}</small><small>{h.checkin} – {h.checkout}</small><div className="df-hotel-badges">{checked&&<span className="df-badge df-badge-cheap">{hotelIndex===i?'Glavni smještaj':'Alternativa'}</span>}{recommendedHotel===i&&<span className="df-badge df-badge-recommended" title="Najniža cijena među smještajima s ocjenom iznad 7">Preporučeno</span>}{features.cancellation&&<span className="df-badge df-badge-cheap">Besplatno otkazivanje</span>}{features.breakfast&&<span className="df-badge df-badge-weekend">Doručak uključen</span>}{features.parking&&<span className="df-badge">{h.freeParking===true?'Besplatan parking':'Parking'}</span>}</div>{h.bookingAffiliateUrl&&<a className="df-flight-check-link" href={h.bookingAffiliateUrl} target="_blank" rel="sponsored noopener noreferrer" onClick={e=>e.stopPropagation()}>Provjeri na Bookingu ↗</a>}</td><td><strong>{h.rating??'—'}/{h.ratingScale}</strong><small>{h.reviews} recenzija</small></td><td><strong>{display.amountCents===null?'Cijena nije dostupna':price(display.amountCents)}</strong><small>Cijeli boravak · {h.adults} osobe</small><button type="button" className="df-text-button" disabled={busy} aria-expanded={editingHotel===i} onClick={e=>{e.stopPropagation();setEditingHotel(editingHotel===i?null:i);}}>Potvrdi cijenu</button></td></tr>;})}</tbody></table></div>
    {editingHotel!==null&&hotels[editingHotel]&&<div className="df-saved-flight-editor"><p><strong>{hotels[editingHotel].name}</strong> · {hotels[editingHotel].checkin} – {hotels[editingHotel].checkout}</p><DealFlightPriceEditor key={`hotel-${editingHotel}`} kind="hotel" initialBreakfast={hotelFeatures(hotels[editingHotel]).breakfast} initialFreeCancellation={hotelFeatures(hotels[editingHotel]).cancellation} initialParking={hotels[editingHotel].parking===true} initialFreeParking={hotels[editingHotel].freeParking===true} busy={busy} action={action} initialPrice={hotelDisplayPrice(hotels[editingHotel]).amountCents===null?undefined:hotelDisplayPrice(hotels[editingHotel]).amountCents!/100} submitLabel="Potvrdi cijenu smještaja" onSave={async fields=>{await api(`/offers/${offer.id}/verify`,{kind:'hotel',index:editingHotel,quickPrice:true,priceEur:fields.priceEur,parking:fields.parking,freeParking:fields.freeParking,freeCancellation:fields.freeCancellation,breakfast:fields.breakfast});setSelectionSaved(false);setPreview('');await onRefresh();}} onCancel={()=>setEditingHotel(null)}/></div>}
    {!eligibleHotels.length&&<p className="df-alert">{matchingHotels.length?'Nema smještaja za uključene tipove. Uključi drugi tip smještaja.':'Nema spremljenih smještaja za ove datume i broj gostiju. Pokreni hotelsku pretragu za taj termin.'}</p>}
    {eligibleHotels.length>5&&<Button white onClick={()=>setShowAllHotels(!showAllHotels)}>{showAllHotels?'Prikaži manje':`Prikaži svih ${eligibleHotels.length} smještaja`}</Button>}
    <details className="df-advanced df-hostel-form"><summary>Dodaj hostelsku opciju (opcionalno)</summary><label>Hostel / partnerska poveznica<input type="url" placeholder="https://www.hostelworld.com/..." value={hostelUrl} onChange={e=>{setHostelUrl(e.target.value);setSelectionSaved(false);}}/></label><div className="grid"><label>Ukupna cijena boravka za dvije osobe (€)<input type="number" min={0.01} step={0.01} value={hostelPrice} onChange={e=>{setHostelPrice(e.target.value);setSelectionSaved(false);}}/></label><label>Tip sobe<select value={hostelRoom} onChange={e=>{setHostelRoom(e.target.value);setSelectionSaved(false);}}><option value="private_room">Privatna soba za dvije osobe</option><option value="shared_bed">Dva kreveta u spavaonici</option></select></label><label>Kupaonica<select value={hostelBathroom} onChange={e=>{setHostelBathroom(e.target.value);setSelectionSaved(false);}}><option value="unknown">Nije potvrđeno</option><option value="private">Privatna kupaonica (ensuite)</option><option value="shared">Zajednička kupaonica</option></select></label></div><div className="df-hostel-features">{[['freeCancellation','Besplatno otkazivanje'],['breakfast','Uključen doručak'],['kitchen','Zajednička kuhinja'],['lockers','Ormarići za stvari']].map(([key,label])=><label key={key} className="df-option-check"><input type="checkbox" checked={hostelAmenities[key]} onChange={e=>{setHostelAmenities(current=>({...current,[key]:e.target.checked}));setSelectionSaved(false);}}/>{label}</label>)}</div><p>Cijeli boravak {stayStart} – {stayEnd}, za dvije osobe, sa svim naknadama. AI priprema zaseban odlomak nakon ostalih smještaja. Hostelska cijena ne mijenja glavni paket u naslovu.</p></details>
    </>}
    <Button adminPrimary disabled={busy||!selectionValid} onClick={()=>action(saveSelection)}>Spremi odabir</Button>
    {selectionSaved&&<p role="status">Odabir je spremljen.</p>}
    <Button white disabled={busy||!selectionValid} onClick={()=>action(async()=>{await saveSelection();setPreview((await api(`/offers/${offer.id}/preview`)).html);})}>Pregled odabranih podataka</Button>
    {preview&&<iframe title="Pregled članka" sandbox="" srcDoc={preview} style={{width:'100%',height:400,border:'1px solid #ddd'}}/>}



    </section>
    <section className="df-detail-step" hidden={step!==2} aria-label="Priprema članka">
    <h3><span>3</span>Pripremi članak</h3>
    <p>Tek kad završiš odabir letova i smještaja, pripremi prijedloge. Vlastiti naslov, podnaslov, opis, uvod i SEO oznake možeš pisati u bilo kojem trenutku, bez AI-ja.</p>
    <div className="df-build-controls"><label>Priprema prijedloga<select value={buildProvider} onChange={e=>setBuildProvider(e.target.value)}><option value="template">Predložak · bez API upita</option><option value="ai" disabled={!offer.capabilities?.aiConfigured}>Groq · 1 API poziv</option></select></label><Button adminPrimary disabled={busy||!selectionValid} onClick={()=>action(prepareContent)}>{buildProvider==='ai'?'Pripremi članak uz Groq · 1 API poziv':'Pripremi prijedloge iz odabira'}</Button></div>
    {!offer.capabilities?.aiConfigured&&<p>AI nije konfiguriran ili uključen. Ručni unos i predložak rade bez AI ključa.</p>}
    {buildMessage&&<p role="status">{buildMessage}</p>}
    <DealEditorialChoice label="Naslov članka" value={title} options={suggestions?.titles||[]} maxLength={100} onChange={setTitle}/>
    <DealEditorialChoice label="Podnaslov članka" value={subtitle} options={suggestions?.subtitles||[]} maxLength={100} onChange={setSubtitle}/>
    <DealEditorialChoice label="Opis članka" value={description} options={suggestions?.descriptions||[]} maxLength={100} onChange={setDescription} multiline/>
    <label>SEO oznake · odvojene zarezom<textarea rows={2} maxLength={255} value={tags} placeholder="Malta, povoljni letovi, Zagreb" onChange={e=>setTags(e.target.value)}/><small>{tags.length}/255 znakova · 5–10 relevantnih oznaka</small></label>
    <DealArticleSectionEditor section={{kind:'intro',subtitle:'',text:intro}} icons={offer.sectionIcons||[]} onChange={section=>{setIntro(section.text);setIntroEdited(true);}}/>
    {sections.filter(section=>!flightsOnly||!['hotel','alternatives','hostel'].includes(section.kind)&&!section.kind.startsWith('alternative_')).map(section=><DealArticleSectionEditor key={section.kind} section={section} icons={offer.sectionIcons||[]} onChange={edited=>{setSectionsEdited(true);setSections(value=>value.map(s=>s.kind===edited.kind?edited:s));}}/>)}
    <Button adminPrimary disabled={busy||!selectionValid||!descriptionValid||!title.trim()||!subtitle.trim()} onClick={()=>action(openEditor)}>Otvori dodavanje članka u CMS-u</Button>
    <p>Otvara se forma <strong>Dodaj članak</strong> s popunjenim tekstom, odlomcima, ikonicama i poveznicama. Tamo dodaj slike i dovrši članak. Otvaranje forme ništa ne upisuje u javne članke.</p>
    </section>
    <footer className="df-detail-footer"><button type="button" className="df-text-button df-reject-offer" disabled={busy} onClick={()=>action(async()=>{await api(`/offers/${offer.id}/status`,{status:'rejected'});await onRefresh();onClose();})}>Odbaci ponudu</button><div><Button white disabled={busy} onClick={()=>step===0?onClose():changeStep(roundup?0:step-1)}>{step===0?'Zatvori':'Natrag'}</Button>{step<2&&<Button adminPrimary disabled={busy} onClick={()=>changeStep(roundup?2:step+1)}>{step===0&&!roundup?'Nastavi na smještaj':'Nastavi na članak'}<ArrowRight size={17}/></Button>}</div></footer>
  </section></dialog>;
}
