import {assert,escapeHtml,renderSelection,renderHostel,skyscanner,hotelBookingLink} from './domain.js';
import {editorialFacts} from './editorialFacts.js';
import {renderFlightNotes} from './baggage.js';
import {hotelPhotos} from './hotels.js';
import {airportByCode} from './airports.js';

export const sectionKinds=['flights','hotel','alternatives','hostel','closing'];
export const sectionDefaults={flights:'Povratne aviokarte',hotel:'Primjer smještaja',alternatives:'Alternativni smještaji',hostel:'Hostelska opcija',closing:'Prije rezervacije'};
// Icons already used for these sections in the public Aviokarte archive.
const iconImages={flights:'53666460054',hotel:'53629517350',alternatives:'53629517350',hostel:'53629517350',closing:'54182086503'};
export function defaultSectionIcon(kind,icons){return icons.find(icon=>!icon.feature_key&&icon.url.includes(iconImages[kind]))?.id??null;}
export function validateSections(sections){
 assert(Array.isArray(sections)&&sections.length<=100,'Neispravni odlomci članka');
 const seen=new Set();return sections.map(section=>{
  assert(section&&(sectionKinds.includes(section.kind)||/^destination_[A-Z]{3}$/.test(section.kind))&&!seen.has(section.kind),'Nepoznat ili ponovljen odlomak');seen.add(section.kind);
  assert(typeof section.subtitle==='string'&&section.subtitle.length<=100,'Naslov odlomka smije imati najviše 100 znakova');
  assert(typeof section.text==='string'&&section.text.length<=10000,'Odlomak smije imati najviše 10000 znakova');
  assert(section.sectionIconId==null||Number.isInteger(section.sectionIconId)&&section.sectionIconId>0,'Neispravna ikonica odlomka');
  return {kind:section.kind,subtitle:section.subtitle,text:section.text,sectionIconId:section.sectionIconId??null};
 });
}
export const paragraphs=text=>String(text||'').split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean).map(p=>`<p>${escapeHtml(p)}</p>`).join('');
function flightExamples(flights,settings){
 const day=value=>{const date=new Date(value+'T12:00:00Z');return `${date.getUTCDate()}.${date.getUTCMonth()+1}. (${date.toLocaleDateString('hr-HR',{weekday:'long',timeZone:'UTC'})})`;};
 const money=value=>new Intl.NumberFormat('hr-HR',{maximumFractionDigits:2}).format(value/100)+' €';
 return '<ul>'+flights.map(f=>`<li><a href="${escapeHtml(skyscanner(f,settings))}" rel="sponsored noopener noreferrer" target="_blank">${escapeHtml(day(f.departureDate))} - ${escapeHtml(day(f.returnDate))}: ${Number.isFinite(f.priceCents)&&f.priceCents>0?money(f.priceCents):'Cijena nije dostupna'}</a></li>`).join('')+'</ul>';
}
function hotelText(offer,hotel,settings){return renderSelection(offer,[],hotel,settings).replace('<ul></ul>','').replace(/<p><a rel="sponsored noopener" href="[^"]*">Pogledaj smještaj<\/a><\/p>/,'').split('<p>Poveznice su partnerske.')[0];}
export function articleSections(offer,flights,hotel,settings,fields={},suggestions={},icons=[]){
 let facts;
 const getFacts=()=>facts??=editorialFacts(typeof offer.toJSON==='function'?offer.toJSON():offer);
 const edited=fields.sections??suggestions.sections??[];
 const kinds=['flights',...(hotel?['hotel']:[]),...((offer.selection.extraHotelIndices||[]).length?['alternatives']:[]),...(offer.selection.hostel?['hostel']:[]),'closing'];
 const result=[{kind:'intro',subtitle:'',text:paragraphs(fields.intro??suggestions.intro??''),sectionIconId:null,link_title:'',link_url:''}];
 for(const kind of kinds){
  const section=edited.find(s=>s.kind===kind),subtitle=section?.subtitle??sectionDefaults[kind];
  const sectionIconId=section?section.sectionIconId:defaultSectionIcon(kind,icons);
  let text=paragraphs(section?.text??'');
  let link_title='',link_url='';
  if(kind==='flights'){
   text+=text?'':'<p>Izdvojili smo povoljne termine povratnih letova. Klikom na datum možeš provjeriti ponudu.</p>';
   if(offer.selection.template==='roundup'){
    result.push({kind,subtitle,text,sectionIconId,link_title,link_url,images:[]});
    const destinations=[...new Set(flights.map(f=>f.destination))];
    destinations.forEach((code,index)=>{
     const routeKind=`destination_${code}`,routeSection=edited.find(s=>s.kind===routeKind);
     const routeFlights=flights.filter(f=>f.destination===code);
     result.push({kind:routeKind,subtitle:routeSection?.subtitle??`${airportByCode(code)?.city||code} (${code})`,text:paragraphs(routeSection?.text||'')+flightExamples(routeFlights,settings)+(index===destinations.length-1?renderFlightNotes(flights):''),sectionIconId:routeSection?.sectionIconId??sectionIconId,link_title:'',link_url:'',images:[]});
    });
    continue;
   }
   text+=flightExamples(flights,settings)+renderFlightNotes(flights);
  }
  if(kind==='hotel'){
   text+=hotelText(offer,hotel,settings);link_title='Pogledaj smještaj';link_url=hotelBookingLink(hotel,settings);
   const packagePrice=getFacts().tokens.package_price;
   if(packagePrice)text+=`<p>Odabrani povratni let i smještaj: ${escapeHtml(packagePrice)}.</p>`;
  }
  if(kind==='alternatives'){
   offer.selection.extraHotelIndices.forEach((hotelIndex,index)=>{const alternative=offer.data.hotels[hotelIndex];result.push({kind:`alternative_${index+1}`,subtitle:`Alternativni smještaj: ${alternative.name}`.slice(0,100),text:(index===0?text:'')+hotelText(offer,alternative,settings),sectionIconId,link_title:'Pogledaj smještaj',link_url:hotelBookingLink(alternative,settings),images:hotelPhotos(alternative)});});continue;
  }
  if(kind==='hostel'){
   const h=offer.selection.hostel;
   const hostelHtml=renderHostel(h,settings),facts=getFacts();
   if(h.adults===2){
    for(const value of [facts.tokens.hostel_price,facts.tokens.hostel_price_person,facts.tokens.hostel_features].filter(Boolean))if(!text.includes(escapeHtml(value)))text+=`<p>${escapeHtml(value)}.</p>`;
   }else text+=hostelHtml.replace(/<p><a[^>]*>Pogledaj hostel<\/a><\/p>/,'');
   link_title='Pogledaj hostel';link_url=h.url;
  }
  if(kind==='closing'&&!text)text='<p>Cijene se mogu promijeniti. Aktualnu cijenu i uvjete provjeri prije rezervacije.</p>';
  result.push({kind,subtitle,text,sectionIconId,link_title,link_url,images:kind==='hotel'?hotelPhotos(hotel):[]});
 }
 return result;
}
export function renderArticleSections(sections,icons=[]){return sections.map(section=>{
 const icon=icons.find(i=>i.id===section.sectionIconId);
 return (section.subtitle?`<h3>${icon?`<img src="${escapeHtml(icon.url)}" alt="" width="24" height="24"> `:''}${escapeHtml(section.subtitle)}</h3>`:'')+section.text+(section.link_url?`<p><a href="${escapeHtml(section.link_url)}" rel="sponsored noopener noreferrer">${escapeHtml(section.link_title||'Pogledaj ponudu')}</a></p>`:'');
}).join('');}
