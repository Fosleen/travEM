/** @typedef {{departureDate:string, returnDate:string, priceCents:number, available?:boolean|null}} FlightDates */
/** Date-only semantics: the browser timezone must never change a flight's weekday. */
const flightDateFormatter=new Intl.DateTimeFormat('hr-HR', {weekday:'long',day:'numeric',month:'numeric',year:'numeric',timeZone:'UTC'});
export function formatFlightDate(value) {
  return flightDateFormatter.format(new Date(value+'T12:00:00Z'));
}
/** @param {FlightDates} flight */
export function tripNights(flight) {
  return (Date.parse(flight.returnDate+'T12:00:00Z')-Date.parse(flight.departureDate+'T12:00:00Z'))/86400000;
}
/** Exact short weekend pairs first; an extended Friday–Monday break comes next. */
/** @param {FlightDates} flight */
export function weekendRank(flight) {
  const start=new Date(flight.departureDate+'T12:00:00Z').getUTCDay();
  const end=new Date(flight.returnDate+'T12:00:00Z').getUTCDay();
  const nights=tripNights(flight);
  if((start===5 && end===0 && nights===2) || (start===6 && end===1 && nights===2) || (start===6 && end===0 && nights===1))return 0;
  if(start===5 && end===1 && nights===3)return 1;
  return 2;
}
/** @param {FlightDates[]} flights */
export function cheapFlightThreshold(flights) {
  const prices=flights.filter(f=>f.available!==false).map(f=>f.priceCents).filter(n=>Number.isFinite(n)&&n>0).sort((a,b)=>a-b);
  return prices.length?prices[Math.max(0,Math.ceil(prices.length*.2)-1)]:null;
}
/** Display only the carrier supplied for this exact flight; never infer it from another date. */
/** @param {Record<string,any>|null|undefined} flight */
export function flightCarrier(flight) {
  for(const value of [flight?.airline,flight?.carrier,flight?.airlineCode])if(typeof value==='string'&&value.trim())return value.trim();
  return null;
}
/** Show the larger per-direction count when both directions are known. */
export function flightStopsLabel(flight) {
  const valid=n=>Number.isInteger(n)&&n>=0;
  const count=valid(flight?.outboundStops)&&valid(flight?.inboundStops)?Math.max(flight.outboundStops,flight.inboundStops):flight?.stops;
  if(!valid(count))return '';
  return count===0?'Direktno':`S ${count} ${count===1?'presjedanjem':'presjedanja'}`;
}
/** Stable source indices are preserved when the displayed order changes. */
/** @param {FlightDates[]} flights @param {string} mode */
export function sortFlightOptions(flights,mode='price') {
  return flights.map((flight,index)=>({flight,index,weekendRank:weekendRank(flight)})).sort((a,b)=>{
    const price=a.flight.priceCents-b.flight.priceCents;
    const date=a.flight.departureDate.localeCompare(b.flight.departureDate)||a.flight.returnDate.localeCompare(b.flight.returnDate);
    if(mode==='weekend')return a.weekendRank-b.weekendRank||price||date||a.index-b.index;
    if(mode==='date')return date||price||a.index-b.index;
    if(mode==='duration')return tripNights(a.flight)-tripNights(b.flight)||price||date||a.index-b.index;
    if(mode==='price_duration')return price||tripNights(a.flight)-tripNights(b.flight)||date||a.index-b.index;
    return price||date||a.index-b.index;
  });
}
