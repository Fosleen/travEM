import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeSearch,discoveryQueries,discoveryQueryCount} from '../app/services/dealFinder/searchRules.js';
import {SerpApiProvider} from '../app/services/dealFinder/providers.js';

const input=normalizeSearch({mode:'discover',discoveryStrategy:'price_limit',origins:['ZAG'],start:'2026-12-01',end:'2026-12-31'});
test('price limit defaults to 100 EUR, uses one unrestricted discovery query and validates limits',()=>{
  assert.equal(input.maxPriceEur,100);
  assert.equal(discoveryQueryCount(input),1);
  const [params]=discoveryQueries(input,'ZAG');
  assert.equal(params.max_price,100);
  assert.equal(params.currency,'EUR');
  assert.equal(params.type,1);
  assert.equal(params.adults,1);
  assert.equal(params.include_airlines,undefined);
  assert.equal(params.query,undefined);
  for(const value of [0,-1,NaN,Infinity,'100',10.5,100001])assert.throws(()=>discoveryQueries({...input,maxPriceEur:value},'ZAG'));
  assert.equal(normalizeSearch({...input,discoveryStrategy:'broad'}).maxPriceEur,undefined);
  assert.equal(normalizeSearch({...input,mode:'route'}).maxPriceEur,undefined);
});
test('price-limited discovery keeps boundary prices and legacy airlines but rejects expensive or out-of-window results',async()=>{
  const calls=[];
  const provider=new SerpApiProvider(async(engine,params)=>{
    calls.push({engine,params});
    return {deals:[
      {arrival_airport_code:'MLA',price:100,airline:'Lufthansa',airline_code:'LH',outbound_date:'2026-12-02',return_date:'2026-12-05'},
      {arrival_airport_code:'ACE',price:100.01,outbound_date:'2026-12-02',return_date:'2026-12-05'},
      {arrival_airport_code:'BSL',price:50,outbound_date:'2026-12-30',return_date:'2027-01-02'},
    ]};
  });
  const result=await provider.search(input);
  assert.equal(calls.length,1);
  assert.equal(calls[0].engine,'google_flights_deals');
  assert.equal(calls[0].params.max_price,100);
  assert.deepEqual(result.flights.map(f=>[f.destination,f.priceCents,f.airlineCode]),[['MLA',10000,'LH']]);
});
