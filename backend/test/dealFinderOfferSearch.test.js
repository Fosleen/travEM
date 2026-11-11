import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceSearchWindow,offerFlightSearchInput,mergeOfferFlights} from '../app/services/dealFinder/offerFlightSearch.js';
import {SerpApiProvider} from '../app/services/dealFinder/providers.js';

const window={start:'2026-12-01',end:'2026-12-31',minimumDays:1};
const f=(departureDate,returnDate,priceCents)=>({origin:'ZAG',destination:'PFO',departureDate,returnDate,priceCents});
const offer={id:7,origin:'ZAG',destination:'PFO',provenance:{searchWindow:window,editorInput:{title:'Vlastiti naslov'}},selection:{flightIndices:[1]},data:{flights:[f('2026-12-04','2026-12-06',5000),f('2026-12-11','2026-12-13',6000)],hotels:[{name:'Existing hotel'}]}};

test('offer search uses persisted discovery window or parent run, never one flight as the original range',()=>{
  assert.deepEqual(sourceSearchWindow(offer),window);
  assert.deepEqual(sourceSearchWindow({...offer,provenance:{discoveryWindow:window,searchWindow:{start:'2026-12-04',end:'2026-12-06'}}}),window);
  assert.deepEqual(sourceSearchWindow({...offer,provenance:{}},window),window);
  assert.equal(sourceSearchWindow({...offer,provenance:{}}),null);
});

test('supplemental request binds both airports to the offer and checks duration and original minimum',()=>{
  const input=offerFlightSearchInput(offer,{origins:['VIE'],destination:'JFK',days:3},window);
  assert.deepEqual(input.origins,['ZAG']);assert.equal(input.destination,'PFO');assert.equal(input.start,window.start);assert.equal(input.offerId,7);assert.equal(input.supplemental,true);
  assert.throws(()=>offerFlightSearchInput(offer,{days:31},window));
  assert.throws(()=>offerFlightSearchInput(offer,{days:2},{...window,minimumDays:5}));
  assert.throws(()=>offerFlightSearchInput(offer,{mode:'discover'},window));
  assert.throws(()=>offerFlightSearchInput(offer,{},null),/Datum/);
});

test('merge updates matching dates in place, appends new dates and retains selection, hotels and editorial text',()=>{
  const original=JSON.stringify(offer);
  const run={id:9,input:offerFlightSearchInput(offer,{days:2},window)};
  const result=mergeOfferFlights(offer,[f('2026-12-11','2026-12-13',5500),f('2026-12-18','2026-12-20',4700)],run);
  assert.equal(result.data.flights.length,3);assert.equal(result.data.flights[1].priceCents,5500);assert.equal(result.data.flights[2].departureDate,'2026-12-18');
  assert.deepEqual(result.data.hotels,offer.data.hotels);assert.deepEqual(result.provenance.searchWindow,window);
  assert.deepEqual(result.provenance.editorInput,offer.provenance.editorInput);assert.equal(result.selection,undefined,'partial update preserves the existing DB selection');
  assert.equal(result.provenance.lastFlightSearch.added,1);assert.equal(result.provenance.lastFlightSearch.updated,1);
  assert.equal(JSON.stringify(offer),original);
  assert.equal(mergeOfferFlights(offer,[],run).data.flights.length,2,'empty result preserves existing dates');
});

test('single fixed-duration calendar returns multiple dates for one query and rejects dates outside the original travel window',async()=>{
  let calls=0;
  const provider=new SerpApiProvider(async(engine,params)=>{
    calls++;assert.equal(engine,'google_flights_calendar');assert.equal(params.round_trip_days,2);assert.equal(params.arrival_id,'PFO');
    return {prices:[{outbound_date:'2026-12-04',return_date:'2026-12-06',price:50},{outbound_date:'2026-12-11',return_date:'2026-12-13',price:60},{outbound_date:'2026-12-30',return_date:'2027-01-01',price:40},{outbound_date:'2026-12-04',return_date:'2026-12-07',price:30},{outbound_date:'2026-12-04',return_date:'2026-12-03',price:30}]};
  });
  const result=await provider.search(offerFlightSearchInput(offer,{days:2},window));
  assert.equal(calls,1);assert.equal(result.flights.length,2);
});
