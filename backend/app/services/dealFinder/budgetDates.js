import {assert,cents,date} from './domain.js';
import {dateSpan} from './searchRules.js';
import {dealFinderAirlines} from '../../../../client/utils/dealFinderAirlines.mjs';

export const budgetDatesEnabled=()=>process.env.DEAL_FINDER_BUDGET_DATES_ENABLED!=='false';

export function budgetCarrierCodes(offer) {
  const codes=new Set();
  for(const f of offer.data?.flights||[]) {
    if(f.available===false||(f.stops!=null&&f.stops!==0))continue;
    const values=[f.airlineCode,...(f.airlineCodes||[])];
    if(values.includes('FR')||/^ryanair$/i.test(f.airline||''))codes.add('FR');
    if(values.includes('PC')||/^pegasus(?:\s+airlines)?$/i.test(f.airline||''))codes.add('PC');
    if(values.some(c=>['W6','W4','W9'].includes(c))||/^wizz\s*air(?:\s+(?:malta|uk))?$/i.test(f.airline||''))for(const c of ['W6','W4','W9'])codes.add(c);
  }
  return [...codes].sort();
}

function calendarRows(response,start,end){
  const rows=new Map();
  for(const row of response.prices||[]){
    try{date(row.outbound_date);}catch{continue;}
    if(row.outbound_date<start||row.outbound_date>end||!Number.isFinite(Number(row.price))||Number(row.price)<=0)continue;
    const price=cents(row.price),previous=rows.get(row.outbound_date);
    if(!previous||price<previous.priceCents)rows.set(row.outbound_date,{date:row.outbound_date,day:Date.parse(row.outbound_date+'T12:00:00Z')/86400000,priceCents:price,searchId:response.search_metadata?.id||null});
  }
  return [...rows.values()];
}
export async function searchBudgetDates(request,input){
  assert(input.origins.length===1,'Kombiniranje se radi za jednu rutu');
  assert(dateSpan(input.start,input.end)<=366,'Za kombiniranje odaberite raspon do godinu dana');
  const origin=input.origins[0],destination=input.destination;
  const params={date_range_start:input.start,date_range_end:input.end,type:2,currency:'EUR',adults:1};
  // No undocumented airline filter. Carrier identity remains unknown until manually checked.
  const outbound=await request('google_flights_calendar',{...params,departure_id:origin,arrival_id:destination});
  const inbound=await request('google_flights_calendar',{...params,departure_id:destination,arrival_id:origin});
  const pairs=[],outboundRows=calendarRows(outbound,input.start,input.end),inboundRows=calendarRows(inbound,input.start,input.end);
  for(const out of outboundRows)for(const back of inboundRows){
    if(back.date<=out.date||back.day-out.day<input.minimumDays)continue;
    pairs.push({id:`${out.date}:${back.date}`,origin,destination,departureDate:out.date,returnDate:back.date,priceCents:out.priceCents+back.priceCents,
      outboundPriceCents:out.priceCents,inboundPriceCents:back.priceCents,outboundSearchId:out.searchId,inboundSearchId:back.searchId,
      priceBasis:'sum_of_oneways_estimate',airline:null,available:null,verifiedAt:null,source:'oneway_calendar_pair',retrievedAt:new Date().toISOString()});
  }
  return {flights:[],hotels:[],candidates:pairs.sort((a,b)=>a.priceCents-b.priceCents||a.id.localeCompare(b.id)),metadata:{coverage:'oneway_pair_candidates',totalCombinations:pairs.length,outboundDates:outboundRows.length,inboundDates:inboundRows.length}};
}

const airlineNames=new Map(dealFinderAirlines.map(a=>[a.id,a.name]));
export function confirmedPairFlight(candidate,input){
  const codes=[...new Set([input.airlineCode,input.outboundAirlineCode,input.inboundAirlineCode].filter(c=>c!==undefined&&c!==null&&c!==''))];
  assert(codes.every(c=>typeof c==='string'&&/^[A-Z0-9]{2}$/.test(c)),'Neispravna oznaka prijevoznika');
  const outboundStops=input.outboundStops??null,inboundStops=input.inboundStops??null;
  assert([outboundStops,inboundStops].every(n=>n===null||Number.isInteger(n)&&n>=0&&n<=10),'Neispravan broj presjedanja');
  const price=cents(input.priceEur);assert(price>0,'Unesite stvarnu konačnu cijenu');
  const at=new Date().toISOString();
  return {origin:candidate.origin,destination:candidate.destination,departureDate:candidate.departureDate,returnDate:candidate.returnDate,priceCents:price,
    outboundAirlineCode:input.outboundAirlineCode??input.airlineCode??null,inboundAirlineCode:input.inboundAirlineCode??input.airlineCode??null,
    airline:codes.length?codes.map(code=>airlineNames.get(code)||code).join(' + '):null,airlineCode:codes.length===1?codes[0]:null,airlineCodes:codes,stops:outboundStops!==null&&inboundStops!==null?Math.max(outboundStops,inboundStops):null,outboundStops,inboundStops,
    priceBasis:'verified_round_trip',source:'manually_verified_pair',available:true,verifiedAt:at,evidence:'Urednički unesena provjerena povratna cijena'};
}
