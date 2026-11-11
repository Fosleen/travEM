import test from 'node:test';
import assert from 'node:assert/strict';
import {searchBudgetDates as searchOneWayPairs,confirmedPairFlight} from '../app/services/dealFinder/budgetDates.js';
import {skyscanner} from '../app/services/dealFinder/domain.js';
const input={mode:'oneway_pairs',origins:['ZAG'],destination:'PFO',start:'2026-12-01',end:'2026-12-31',minimumDays:2};
test('two calendars produce multiple durations as separate estimates without inventing carrier identity',async()=>{
  const calls=[];
  const result=await searchOneWayPairs(async(engine,params)=>{
    calls.push({engine,params});
    return {prices:params.departure_id==='ZAG'?[{outbound_date:'2026-12-04',price:20},{outbound_date:'2026-12-05',price:30},{outbound_date:'2026-12-05',price:40},{outbound_date:'2026-11-30',price:1}]:[{outbound_date:'2026-12-06',price:15},{outbound_date:'2026-12-11',price:10},{outbound_date:'2027-01-01',price:1}]};
  },input);
  assert.equal(calls.length,2);assert.equal(calls[1].params.departure_id,'PFO');assert.ok(calls.every(c=>c.params.type===2&&c.params.adults===1&&c.params.include_airlines===undefined));
  assert.equal(result.candidates.length,3);assert.equal(result.candidates[0].priceCents,3000);assert.equal(result.flights.length,0);
  assert.ok(result.candidates.every(c=>c.airline===null&&c.available===null&&c.verifiedAt===null&&c.priceBasis==='sum_of_oneways_estimate'));
  const link=new URL(skyscanner({...result.candidates[0],airlineCodes:['FR','W6']}));
  assert.equal(link.searchParams.get('outboundDate'),'2026-12-04');assert.equal(link.searchParams.get('inboundDate'),'2026-12-11');assert.equal(link.searchParams.get('mediaPartnerId'),'6483817');assert.equal(link.searchParams.get('airlines'),'FR,W6');assert.equal(link.searchParams.get('adultsv2'),'1');
});
test('manual price needs only a positive amount; carrier is optional and unknown stops are preserved',()=>{
  const candidate={origin:'ZAG',destination:'PFO',departureDate:'2026-12-04',returnDate:'2026-12-11',priceCents:3000};
  const valid={confirmedRoundTrip:true,confirmedDirectFlights:true,priceEur:43,seller:'Ryanair',evidence:'Checked both dates in one Skyscanner search',outboundAirlineCode:'FR',inboundAirlineCode:'FR'};
  assert.throws(()=>confirmedPairFlight(candidate,{priceEur:0}));assert.throws(()=>confirmedPairFlight(candidate,{...valid,inboundAirlineCode:'INVALID'}));assert.throws(()=>confirmedPairFlight(candidate,{...valid,priceEur:null}));
  const flight=confirmedPairFlight(candidate,valid);assert.equal(flight.priceCents,4300);assert.equal(flight.airline,'Ryanair');assert.equal(flight.available,true);assert.equal(flight.priceBasis,'verified_round_trip');
  const priceOnly=confirmedPairFlight(candidate,{priceEur:49});assert.equal(priceOnly.priceCents,4900);assert.equal(priceOnly.airline,null);assert.equal(priceOnly.stops,null);assert.equal(priceOnly.outboundStops,null);
  assert.equal(confirmedPairFlight(candidate,{priceEur:49,airlineCode:'W4'}).airline,'Wizz Air Malta');
});
