import test from 'node:test';
import assert from 'node:assert/strict';
import {sortOffers,offerSummary} from '../../client/utils/dealFinderOffers.mjs';
import {offerAirportNames,discoveryDestinationAllowed} from '../app/services/dealFinder/airports.js';
import {SerpApiProvider} from '../app/services/dealFinder/providers.js';
import {discoveryQueryCount} from '../app/services/dealFinder/searchRules.js';
import {flightCarrier} from '../../client/utils/dealFinderFlights.mjs';
const flight=(priceCents,departureDate='2027-01-05',returnDate='2027-01-10',extra={})=>({priceCents,departureDate,returnDate,...extra});
const offer=(id,flights,status='needs_verification')=>({id,status,data:{flights}});

test('offer sorting ranks lowest stored fares and keeps rejected offers last for every mode',()=>{
  const offers=[offer(1,[flight(21600)]),offer(2,[flight(5800)]),offer(3,[flight(1000)],'rejected'),offer(4,[flight(2000)],'verified'),offer(5,[])];
  assert.deepEqual(sortOffers(offers).map(o=>o.id),[2,1,5,4,3]);
  for(const mode of ['weekend','date','duration','value'])assert.equal(sortOffers(offers,mode).at(-1).id,3);
  assert.equal(offers[0].id,1);
  assert.equal(offerSummary(offer(6,[flight(100,'2027-01-01','2027-01-03',{available:false}),flight(5000)])).cheapest,5000);
});
test('selected work stays first in every sorting mode regardless of its price',()=>{
  const offers=[offer(1,[flight(1000)]),offer(2,[flight(30000)],'ready_for_selection'),offer(3,[flight(500)],'rejected')];
  for(const mode of ['price','weekend','date','duration','value'])assert.deepEqual(sortOffers(offers,mode).map(o=>o.id),[2,1,3]);
});

test('card carrier belongs to the cheapest available dated fare, never a more expensive known airline',()=>{
  const item=offer(1,[flight(1000,'2027-01-01','2027-01-03',{airline:'Unavailable',available:false}),flight(5800,'2027-01-02','2027-01-04',{airline:'Ryanair'}),flight(9000,'2027-01-03','2027-01-05',{airline:'Turkish Airlines'})]);
  assert.equal(flightCarrier(offerSummary(item).cheapestFlight),'Ryanair');
  item.data.flights[1].airline=null;
  assert.equal(flightCarrier(offerSummary(item).cheapestFlight),null);
  assert.equal(flightCarrier({airline:' Wizz Air '}),'Wizz Air');assert.equal(flightCarrier({airlineCode:'FR'}),'FR');assert.equal(flightCarrier(null),null);
});

test('weekend sorts by the actual weekend fare; price, date, duration and relative value remain distinct',()=>{
  const offers=[offer(1,[flight(3000),flight(9000,'2027-01-01','2027-01-03')]),offer(2,[flight(6000,'2027-01-02','2027-01-03',{averagePriceCents:20000})]),offer(3,[flight(5000,'2027-01-01','2027-01-04',{averagePriceCents:5500})])];
  assert.deepEqual(sortOffers(offers,'weekend').map(o=>o.id),[2,1,3]);
  assert.equal(sortOffers(offers,'price')[0].id,1);
  assert.equal(sortOffers(offers,'duration')[0].id,2);
  assert.equal(sortOffers(offers,'date')[0].id,1);
  assert.equal(sortOffers(offers,'value')[0].id,2);
  assert.equal(offerSummary(offers[0]).value,Infinity,'unknown average is not a fabricated discount');
});

test('outside Europe badges respect editorial exceptions for Spanish and Portuguese islands',()=>{
  for(const code of ['RAK','JFK'])assert.equal(offerAirportNames({origin:'ZAG',destination:code}).outsideEurope,true);
  for(const code of ['LHR','BSL','BEG','TFS','ACE','PDL','FNC'])assert.equal(offerAirportNames({origin:'ZAG',destination:code}).outsideEurope,false);
  assert.equal(offerAirportNames({origin:'ZAG',destination:'ZZZ'}).outsideEurope,null);
  for(const code of ['PFO','LCA','KGS'])assert.equal(offerAirportNames({origin:'ZAG',destination:code}).outsideEurope,false);
  assert.equal(offerAirportNames({origin:'ZAG',destination:'YYZ'}).outsideEurope,true);
});

test('discovery filters origin country and land neighbours, keeping Milan and respecting each origin separately',()=>{
  for(const destination of ['SPU','OSI','DBV','LJU','BUD','BEG','SJJ'])assert.equal(discoveryDestinationAllowed('ZAG',destination),false,destination);
  for(const destination of ['BGY','STN','PFO','RAK','YYZ','TGD','TIV'])assert.equal(discoveryDestinationAllowed('ZAG',destination),true,destination);
  assert.equal(discoveryDestinationAllowed('BUD','VIE'),false);
  assert.equal(discoveryDestinationAllowed('ZAG','VIE'),true,'Austria is not a land neighbour of Croatia');
  assert.equal(discoveryDestinationAllowed('VCE','BGY'),false,'domestic rules also apply outside Croatia');
});

test('country exclusions cost no extra requests and do not restrict explicitly targeted routes',async()=>{
  let calls=0;
  const provider=new SerpApiProvider(async(engine)=>{
    calls++;
    return engine==='google_flights_deals'?{deals:['SPU','LJU','BGY','RAK'].map(arrival_airport_code=>({arrival_airport_code,start_date:'2026-12-04',end_date:'2026-12-06',price:50}))}:{prices:[{outbound_date:'2026-12-04',return_date:'2026-12-05',price:50}]};
  });
  const input={mode:'discover',origins:['ZAG'],start:'2026-12-01',end:'2026-12-31',minimumDays:1};
  const result=await provider.search(input);
  assert.equal(calls,1);assert.deepEqual(result.flights.map(f=>f.destination),['BGY','RAK']);
  assert.ok(result.metadata.excludedCountriesByOrigin.ZAG.includes('HR'));
  const targeted=await provider.search({...input,mode:'route',destination:'SPU',start:'2026-12-04',end:'2026-12-05'});
  assert.equal(calls,2);assert.equal(targeted.flights[0].destination,'SPU');
});

test('discovery preserves provider average for local value ranking without adding requests',async()=>{
  let calls=0;
  const provider=new SerpApiProvider(async()=>{calls++;return {deals:[{arrival_airport_code:'BGY',start_date:'2026-12-04',end_date:'2026-12-06',price:58,average_price:120,airline:'Ryanair',airline_code:'FR'}]};});
  const result=await provider.search({mode:'discover',origins:['ZAG'],start:'2026-12-01',end:'2026-12-31',minimumDays:1});
  assert.equal(calls,1);assert.equal(result.flights[0].averagePriceCents,12000);
  assert.equal(result.flights[0].airline,'Ryanair');assert.equal(result.flights[0].airlineCode,'FR');
  assert.equal(offerSummary(offer(1,result.flights)).value,58/120);
});

test('cheap-first discovery uses two declared requests, keeps distant bargains and merges duplicate dates at the lower price',async()=>{
  const calls=[];
  const provider=new SerpApiProvider(async(engine,params)=>{
    calls.push({engine,params});
    const row=(destination,price,airline_code='FR')=>({arrival_airport_code:destination,start_date:'2026-12-04',end_date:'2026-12-06',price,average_price:200,airline_code});
    return {deals:params.include_airlines?[row('BGY',58),row('IST',143,'PC')]:[row('BGY',60),row('RAK',150,'TK'),row('EIN',216),row('ATH',100,'JU'),row('JFK',396,'LH')]};
  });
  const input={mode:'discover',origins:['ZAG'],start:'2026-12-01',end:'2026-12-31',minimumDays:1,discoveryStrategy:'cheap_first',cheapDiscoveryMaxEur:100};
  const result=await provider.search(input);
  assert.equal(calls.length,2);assert.equal(discoveryQueryCount(input),2);
  assert.equal(calls[0].params.include_airlines,'FR,W6,W4,W9,PC');assert.equal(calls[1].params.trip_length,undefined);assert.match(calls[1].params.query,/outside Europe/);
  assert.equal(result.flights.length,5);assert.equal(result.flights.find(f=>f.destination==='BGY').priceCents,5800);assert.equal(result.flights.some(f=>f.destination==='ATH'),false);
  assert.equal(result.flights.find(f=>f.destination==='RAK').priceCents,15000);
  assert.throws(()=>discoveryQueryCount({...input,discoveryStrategy:'invalid'}));
});
