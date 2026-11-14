import {sortFlightOptions} from './dealFinderFlights.mjs';
/** One display list; persisted flight indices remain unchanged for CMS selection. */
export function flightSelectionRows(flights,candidates=[]){
  const key=f=>`${f.origin}:${f.destination}:${f.departureDate}:${f.returnDate}`;
  const rows=flights.map((flight,index)=>({key:key(flight),flight,index,candidateId:null}));
  const saved=new Set(rows.map(row=>row.key)),additional=new Map();
  for(const flight of candidates){
    const identity=key(flight);if(saved.has(identity))continue;
    const previous=additional.get(identity);
    if(!previous||flight.priceCents<previous.flight.priceCents)additional.set(identity,{key:identity,flight,index:null,candidateId:flight.id});
  }
  return [...rows,...additional.values()];
}
/** Price confirmation is the primary order; checkbox changes never move a row. */
export function sortFlightSelectionRows(rows,mode='price'){
  const confirmed=row=>row.index!==null&&row.flight.available!==false&&Boolean(row.flight.verifiedAt||row.flight.reviewStatus==='verified');
  return sortFlightOptions(rows.map(row=>row.flight),mode).sort((a,b)=>Number(confirmed(rows[b.index]))-Number(confirmed(rows[a.index])));
}
/** Count actual article selections across all pages, independent of display order. */
export function selectedDestinationCounts(flights,selected){
  /** @type {Record<string,number>} */
  const counts={};
  for(const index of new Set(selected)){
    const destination=flights[index]?.destination;
    if(destination)counts[destination]=(counts[destination]||0)+1;
  }
  return counts;
}
