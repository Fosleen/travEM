import {assert} from './domain.js';
import {dateSpan} from './searchRules.js';
import {budgetCarrierCodes,budgetDatesEnabled} from './budgetDates.js';

export function sourceSearchWindow(offer,parentInput={}) {
  for(const candidate of [offer.provenance?.discoveryWindow,offer.provenance?.searchWindow,parentInput]) {
    try {dateSpan(candidate?.start,candidate?.end);return {start:candidate.start,end:candidate.end,minimumDays:candidate.minimumDays??1};}catch{/* Try persisted parent run; never infer a monthly window from one flight. */}
  }
  return null;
}
export function offerFlightSearchInput(offer,options,window) {

  const airlineCodes=budgetCarrierCodes(offer);
  const mode=options.mode||(airlineCodes.length?'budget_dates':'calendar');assert(['calendar','route','budget_dates'].includes(mode),'Odaberite podržan način dopune');
  if(airlineCodes.length)assert(mode==='budget_dates','Za budget rutu koristite kombiniranje kalendara');
  const start=options.start||window?.start,end=options.end||window?.end,span=dateSpan(start,end);
  const minimumDays=options.minimumDays??window?.minimumDays??1;
  assert(Number.isInteger(minimumDays)&&minimumDays>=1&&minimumDays<=span,'Minimalno trajanje mora stati u odabrani raspon');
  const days=options.days??Math.min(span,Math.max(2,minimumDays));
  if(mode==='calendar')assert(Number.isInteger(days)&&days>=minimumDays&&days<=Math.min(span,60),'Trajanje mora stati u raspon i poštovati minimum (najviše 60 dana)');
  let budget={};
  if(mode==='budget_dates'){
    assert(budgetDatesEnabled(),'Budget pretraga je isključena na serveru');
    assert(span<=366,'Odaberite raspon do godinu dana');
    assert(airlineCodes.length,'Nema poznatog budget prijevoznika');
    budget={airlineCodes,calendarPairVersion:2};
  }
  return {mode,origins:[offer.origin],destination:offer.destination,offerId:offer.id,supplemental:true,start,end,minimumDays,...(mode==='calendar'?{days}:{}),...budget,adults:1,overrides:offer.provenance?.overrides||{}};
}

export function mergeOfferFlights(offer,incoming,run) {
  const merged=new Map((offer.data.flights||[]).map(f=>[`${f.departureDate}:${f.returnDate}`,f]));
  let added=0,updated=0;
  for(const flight of incoming) {
    const key=`${flight.departureDate}:${flight.returnDate}`,previous=merged.get(key);
    if(previous)updated++;else added++;
    merged.set(key,{...flight,priceHistory:[...(previous?.priceHistory||[]),{priceCents:flight.priceCents,at:new Date().toISOString()}].slice(-20)});
  }
  return {data:{...offer.data,flights:[...merged.values()],flightArchive:(offer.data.flightArchive||[]).filter(f=>!merged.has(`${f.departureDate}:${f.returnDate}`))},
    provenance:{...offer.provenance,lastFlightSearch:{runId:run.id,mode:run.input.mode,start:run.input.start,end:run.input.end,days:run.input.days,minimumDays:run.input.minimumDays,added,updated,returned:incoming.length,at:new Date().toISOString()}}};
}
