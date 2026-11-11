import test from 'node:test';
import assert from 'node:assert/strict';
import {budgetCarrierCodes,searchBudgetDates} from '../app/services/dealFinder/budgetDates.js';
import {offerFlightSearchInput} from '../app/services/dealFinder/offerFlightSearch.js';
import {skyscanner} from '../app/services/dealFinder/domain.js';
const flight={departureDate:'2026-12-15',returnDate:'2026-12-22',priceCents:9500,stops:0,airlineCode:'FR',airline:'Ryanair'};
const offer={id:1,origin:'ZAG',destination:'ACE',data:{flights:[flight]},provenance:{}};
const window={start:'2026-12-01',end:'2026-12-31',minimumDays:1};

test('calendar combinations preserve minimum duration across leap-day and month boundaries',async()=>{
  const input={origins:['ZAG'],destination:'PFO',start:'2028-02-28',end:'2028-03-02',minimumDays:2};
  const result=await searchBudgetDates(async(engine,params)=>({prices:params.departure_id==='ZAG'
    ?[{outbound_date:'2028-02-28',price:10},{outbound_date:'2028-02-29',price:20},{outbound_date:'2028-03-01',price:5}]
    :[{outbound_date:'2028-02-29',price:3},{outbound_date:'2028-03-01',price:4},{outbound_date:'2028-03-02',price:8}]}),input);
  assert.deepEqual(result.candidates.map(c=>[c.departureDate,c.returnDate,c.priceCents]),[
    ['2028-02-28','2028-03-01',1400],['2028-02-28','2028-03-02',1800],['2028-02-29','2028-03-02',2800],
  ]);
});
test('budget pairing eligibility is carrier-based; old limits and carrier overrides cannot change the plan',()=>{
  for(const destination of ['ACE','RAK','DXB','YYZ'])assert.deepEqual(budgetCarrierCodes({...offer,destination}),['FR']);
  assert.deepEqual(budgetCarrierCodes({...offer,data:{flights:[{...flight,airlineCode:'W4',airline:'Wizz Air Malta'}]}}),['W4','W6','W9']);
  assert.deepEqual(budgetCarrierCodes({...offer,data:{flights:[{...flight,airlineCode:'TK',airline:'Turkish Airlines'}]}}),[]);
  const input=offerFlightSearchInput(offer,{mode:'budget_dates',airlineCodes:['TK'],pairLimit:1,datePairs:[{}]},window);
  assert.deepEqual(input.airlineCodes,['FR']);assert.equal(input.pairLimit,undefined);assert.equal(input.datePairs,undefined);assert.equal(input.calendarPairVersion,2);
  assert.throws(()=>offerFlightSearchInput(offer,{start:'2026-12-01',end:'2026-12-02',minimumDays:2},window));
});
test('exactly two calendars yield all 465 combinations, no top-N cap, no carrier filter or paid verification',async()=>{
  const input=offerFlightSearchInput(offer,{},window),calls=[];
  const result=await searchBudgetDates(async(engine,params)=>{
    calls.push({engine,params});
    const prices=Array.from({length:31},(_,i)=>({outbound_date:'2026-12-'+String(i+1).padStart(2,'0'),price:i+10}));
    return {prices:[...prices,{outbound_date:'2026-12-01',price:100},{outbound_date:'invalid',price:1},{outbound_date:'2027-01-01',price:1},{outbound_date:'2026-12-02',price:-1}]};
  },input);
  assert.equal(calls.length,2);assert.ok(calls.every(c=>c.engine==='google_flights_calendar'&&c.params.type===2&&c.params.adults===1&&c.params.currency==='EUR'&&c.params.include_airlines===undefined));
  assert.equal(calls[1].params.departure_id,'ACE');assert.equal(calls[1].params.arrival_id,'ZAG');
  assert.equal(result.flights.length,0);assert.equal(result.candidates.length,465);assert.equal(result.metadata.totalCombinations,465);
  assert.equal(result.candidates[0].priceCents,2100);
  assert.ok(result.candidates.every(c=>c.airline===null&&c.verifiedAt===null&&c.available===null&&c.priceBasis==='sum_of_oneways_estimate'));
  assert.ok(result.candidates.every((c,i)=>i===0||c.priceCents>=result.candidates[i-1].priceCents));
  const link=new URL(skyscanner(result.candidates[0]));assert.equal(link.searchParams.get('outboundDate'),'2026-12-01');assert.equal(link.searchParams.get('inboundDate'),'2026-12-02');assert.equal(link.searchParams.has('airlines'),false);
  const min=await searchBudgetDates(async()=>({prices:[{outbound_date:'2026-12-01',price:10},{outbound_date:'2026-12-02',price:10},{outbound_date:'2026-12-15',price:10}]}),{...input,minimumDays:5});
  assert.equal(min.candidates.length,2);
  let count=0;const empty=await searchBudgetDates(async()=>{count++;return {prices:[]};},input);assert.equal(count,2);assert.equal(empty.candidates.length,0);
});
