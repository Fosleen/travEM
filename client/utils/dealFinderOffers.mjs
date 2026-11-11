import {weekendRank,tripNights} from './dealFinderFlights.mjs';

/** @param {Record<string,any>} offer */
export function offerSummary(offer) {
  let cheapest=Infinity,cheapestFlight=null,weekend=2,weekendPrice=Infinity,earliest=Infinity,duration=Infinity,value=Infinity;
  for(const flight of offer.data?.flights||[]){
    if(flight.available===false||!Number.isFinite(flight.priceCents)||flight.priceCents<=0)continue;
    const departure=Date.parse(flight.departureDate);
    if(!Number.isFinite(departure)||!Number.isFinite(Date.parse(flight.returnDate)))continue;
    if(flight.priceCents<cheapest){cheapest=flight.priceCents;cheapestFlight=flight;}
    const rank=weekendRank(flight);
    if(rank<weekend)weekendPrice=flight.priceCents;
    else if(rank===weekend)weekendPrice=Math.min(weekendPrice,flight.priceCents);
    weekend=Math.min(weekend,rank);
    if(Number.isNaN(weekend))weekendPrice=Infinity;
    earliest=Math.min(earliest,departure);
    duration=Math.min(duration,tripNights(flight));
    // Missing average is unknown, never an invented discount.
    if(Number.isFinite(flight.averagePriceCents)&&flight.averagePriceCents>0)value=Math.min(value,flight.priceCents/flight.averagePriceCents);
  }
  return {cheapest,cheapestFlight,weekend,weekendPrice,earliest,duration,value};
}
const statusRank=status=>status==='ready_for_selection'?-1:status==='rejected'?2:['needs_verification','discovered','unverified','stale'].includes(status)?0:1;
const compare=(a,b)=>a===b?0:a<b?-1:1;
/** Status groups remain in place for every sort mode. Never mutate the source list. */
/** @param {Array<Record<string,any>>} offers @param {string} mode */
export function sortOffers(offers,mode='price') {
  return offers.map((offer,index)=>({offer,index,summary:offerSummary(offer)})).sort((a,b)=>{
    const status=statusRank(a.offer.status)-statusRank(b.offer.status);if(status)return status;
    const x=a.summary,y=b.summary;
    if(mode==='weekend'){const rank=compare(x.weekend,y.weekend)||compare(x.weekendPrice,y.weekendPrice);if(rank)return rank;}
    if(mode==='date'){const rank=compare(x.earliest,y.earliest);if(rank)return rank;}
    if(mode==='duration'){const rank=compare(x.duration,y.duration);if(rank)return rank;}
    if(mode==='value'){const rank=compare(x.value,y.value);if(rank)return rank;}
    return compare(x.cheapest,y.cheapest)||a.index-b.index;
  }).map(item=>item.offer);
}
