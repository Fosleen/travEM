import {escapeHtml} from './domain.js';

// Official policies checked 2026-11-08. Applies to base fares, not an inferred
// fare bundle. Keep separate from AI copy and from the identity of other dates.
const policies={
 FR:{name:'Ryanair',url:'https://help.ryanair.com/hc/en-us/articles/12888036565521-Ryanair-s-Bag-Policy',text:'U osnovnu Ryanair tarifu uključena je jedna mala osobna torba dimenzija do 40 × 30 × 20 cm, koja mora stati ispod sjedala ispred tebe. Za veći kabinski kofer ili predanu prtljagu možeš nadoplatiti. Opcija Priority & 2 Cabin Bags uključuje i kabinski kofer do 10 kg, dimenzija 55 × 40 × 20 cm.'},
 W6:{name:'Wizz Air',url:'https://www.wizzair.com/en-gb/help-centre/booking-information-and-services/baggage/baggage-allowance',text:'U osnovnu Wizz Air tarifu uključena je jedna mala ručna torba dimenzija do 40 × 30 × 20 cm, do 10 kg, koja ide ispod sjedala. Veći kabinski kofer ili predana prtljaga dodatno se plaćaju. Uz WIZZ Priority možeš ponijeti i dodatni kabinski kofer dimenzija do 55 × 40 × 23 cm, do 10 kg.'},
};
export const fareChangeNotice='Cijene avionskih karata brzo se mijenjaju prema potražnji i broju preostalih mjesta. Ako pronađeš let i termin koji ti odgovaraju, rezerviraj što prije jer cijena može porasti ili ponuda može nestati.';
export function flightBaggageDetails(result){
 const values=[...(Array.isArray(result.baggageDetails)?result.baggageDetails:[]),...(Array.isArray(result.extensions)?result.extensions:[])];
 return [...new Set(values.filter(value=>typeof value==='string'&&/baggage|carry.on|checked bag|personal (?:bag|item)|bag and fare conditions|prtljag/i.test(value)).map(value=>value.slice(0,500)))].slice(0,12);
}
function carriers(flight){
 const codes=[flight.airlineCode,...(flight.airlineCodes||[])].filter(Boolean).map(code=>['W4','W9'].includes(code)?'W6':code);
 const name=flight.airline||flight.carrier||'';
 if(/ryanair/i.test(name))codes.push('FR');if(/wizz\s*air/i.test(name))codes.push('W6');
 return [...new Set(codes.length?codes:[name||'Nepoznat prijevoznik'])];
}
function translatedDetail(detail){
 if(/^checked baggage for a fee$/i.test(detail))return 'Predana prtljaga dodatno se naplaćuje.';
 if(/^bag and fare conditions depend on the return flight$/i.test(detail))return 'Uvjeti prtljage ovise i o odabranom povratnom letu.';
 if(/^(?:carry.on bags?|cabin bags?) (?:for a fee|not included)$/i.test(detail))return 'Veća kabinska prtljaga nije uključena u prikazanu cijenu.';
 const included=detail.match(/^(\d+) (?:free (carry.on|checked) bags?|(carry.on|checked) bags?(?: \((\d+) kg\))? (?:included|free))$/i);
 if(included){const kind=(included[2]||included[3]).toLowerCase()==='checked'?'predane':'kabinske',count=Number(included[1]),unit=count%10===1&&count%100!==11?'komad':'komada';return `Prikazana cijena obuhvaća ${count} ${unit} ${kind} prtljage${included[4]?` do ${included[4]} kg`:''} bez doplate.`;}
 return null;
}
export function renderFlightNotes(flights){
 const groups=new Map();
 for(const flight of flights)for(const carrier of carriers(flight)){if(!groups.has(carrier))groups.set(carrier,[]);groups.get(carrier).push(flight);}
 let html='';
 for(const [carrier,options] of groups){
  const policy=policies[carrier],details=[...new Set(options.flatMap(f=>flightBaggageDetails(f)).map(translatedDetail).filter(Boolean))];
  const name=policy?.name||options[0].airline||carrier;
  if(policy)html+=`<p>${escapeHtml(policy.text)} <a href="${escapeHtml(policy.url)}" target="_blank" rel="noopener noreferrer">Pravila prtljage: ${escapeHtml(policy.name)}</a></p>`;
  if(details.length)html+=`<p>${escapeHtml(name)}: ${escapeHtml(details.join(' '))} Prije kupnje provjeri uključenu prtljagu za odabranu tarifu i oba smjera.</p>`;
  else if(!policy)html+=`<p>${escapeHtml(name)}: uključena prtljaga ovisi o odabranoj tarifi. U ovoj pretrazi nema potvrđenog podatka o prtljazi; provjeri dopuštene dimenzije, težinu i moguće doplate prije kupnje.</p>`;
 }
 return html+`<p>${escapeHtml(fareChangeNotice)}</p>`;
}
