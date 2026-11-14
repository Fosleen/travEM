import {assert,date} from './domain.js';
import {routeDestinations} from './airports.js';
// Discovery allowlist only; this does not change which routes use budget date pairing.
export const discoveryBudgetCodes=['FR','W6','W4','W9','PC','EW','U2','EC','DS','V7','VY','HV','TO','DY','D8','BT','LS','3F'];
export function isDiscoveryBudgetCarrier(flight) {
  return discoveryBudgetCodes.includes(flight.airline_code)||/^(ryanair|wizz\s*air(?:\s+(?:malta|uk))?|pegasus(?:\s+airlines)?|eurowings(?:\s+europe)?|easyjet(?:\s+(?:europe|switzerland|uk))?|volotea|vueling(?:\s+airlines)?|transavia(?:\s+(?:france|airlines))?|norwegian(?:\s+air(?:\s+(?:shuttle|sweden))?)?|air\s*baltic|jet2(?:\.com)?|fly\s*one\s+armenia)$/i.test((flight.airline||'').trim());
}
export function dateSpan(start,end) {
  const days=(Date.parse(date(end)+'T12:00:00Z')-Date.parse(date(start)+'T12:00:00Z'))/86400000;
  assert(Number.isInteger(days)&&days>=1,'Do datuma mora biti barem dan nakon Od datuma');
  return days;
}
export function addDays(value,days) {
  const result=new Date(date(value)+'T12:00:00Z');result.setUTCDate(result.getUTCDate()+days);return result.toISOString().slice(0,10);
}
export function normalizeSearch(input) {
  const mode=input.mode||'discover';
  const {maxPriceEur,...rest}=input;
  return {...rest,mode,...(mode==='discover'&&input.discoveryStrategy==='price_limit'?{maxPriceEur:maxPriceEur??100}:{}),minimumDays:input.minimumDays??(mode==='discover'?input.days??1:1),adults:mode==='hotels'?2:1,rooms:input.rooms??1};
}
export function matchesSearch(flight,input) {
  try {
    const duration=dateSpan(flight.departureDate,flight.returnDate);
    return (!input.start||flight.departureDate>=input.start)&&(!input.end||flight.returnDate<=input.end)&&duration>=(input.minimumDays??(input.mode==='discover'?input.days??1:1))&&(input.mode!=='discover'||input.discoveryStrategy!=='price_limit'||flight.priceCents<=Math.round(input.maxPriceEur*100));
  }catch{return false;}
}
export function discoveryParams(input,origin) {
  const span=dateSpan(input.start,input.end),minimum=input.minimumDays??input.days??1;
  assert(Number.isInteger(minimum)&&minimum>=1&&minimum<=span,'Minimalno trajanje mora stati u odabrani raspon datuma');
  const latestDeparture=addDays(input.end,-minimum);
  const dates=latestDeparture===input.start
    ? {outbound_date:input.start,return_date:input.end}
    : {outbound_date:`${input.start},${latestDeparture}`,trip_length:`${minimum},${span}`};
  return {departure_id:origin,...dates,type:1,currency:'EUR',adults:1};
}
export function routeQueryCount(input) {
  const span=dateSpan(input.start,input.end),minimum=input.minimumDays??1;
  assert(Number.isInteger(minimum)&&minimum>=1&&minimum<=span,'Minimalno trajanje mora stati u odabrani raspon datuma');
  return (span-minimum+1)*routeDestinations(input).length;
}
export function discoveryQueryCount(input) {
  assert(['broad','cheap_first','price_limit'].includes(input.discoveryStrategy||'broad'),'Nepoznata strategija otkrivanja destinacija');
  if(input.discoveryStrategy==='price_limit')assert(typeof input.maxPriceEur==='number'&&Number.isFinite(input.maxPriceEur)&&input.maxPriceEur>=1&&input.maxPriceEur<=100000&&Number.isInteger(input.maxPriceEur),'Najviša cijena mora biti cijeli broj od 1 do 100000 €');
  return input.discoveryStrategy==='cheap_first'?2:1;
}
export function discoveryQueries(input,origin) {
  const params=discoveryParams(input,origin);
  if(discoveryQueryCount(input)===1)return [{...params,...(input.discoveryStrategy==='price_limit'?{max_price:input.maxPriceEur}:{})}];
  const {trip_length,...outside}=params;
  void trip_length;
  return [{...params,include_airlines:discoveryBudgetCodes.join(',')},
    {...outside,...(params.outbound_date.includes(',')?{return_date:`${addDays(input.start,input.minimumDays??1)},${input.end}`} :{}),query:'Cheapest round-trip flights to destinations outside Europe'}];
}
export function* routeParams(input,origin) {
  const count=routeQueryCount(input)/routeDestinations(input).length;
  for(const destination of routeDestinations(input))for(let offset=0;offset<count;offset++)yield {
    departure_id:origin,arrival_id:destination,date_range_start:addDays(input.start,offset),
    date_range_end:input.end,fixed_outbound_date:true,type:1,currency:'EUR',adults:1
  };
}
