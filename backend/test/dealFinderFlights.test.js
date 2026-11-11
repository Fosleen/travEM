import test from 'node:test';
import assert from 'node:assert/strict';
import {formatFlightDate,weekendRank,sortFlightOptions,tripNights,cheapFlightThreshold,flightStopsLabel} from '../../client/utils/dealFinderFlights.mjs';
const f=(departureDate,returnDate,priceCents)=>({departureDate,returnDate,priceCents});
test('combined price and duration sorting prefers price then shortest trip without changing source indices',()=>{
  const flights=[f('2027-01-01','2027-01-10',10000),f('2027-01-02','2027-01-04',10000),f('2027-01-01','2027-01-12',9000),f('2027-01-03','2027-01-04',11000)];
  assert.deepEqual(sortFlightOptions(flights,'price_duration').map(o=>o.index),[2,1,0,3]);
});
test('stop labels show direct or the stop count and omit unknown values',()=>{
  assert.equal(flightStopsLabel({outboundStops:0,inboundStops:1}),'S 1 presjedanjem');
  assert.equal(flightStopsLabel({stops:0}),'Direktno');
  assert.equal(flightStopsLabel({stops:2}),'S 2 presjedanja');
  assert.equal(flightStopsLabel({stops:null}),'');
});
test('weekday display uses Croatian date-only values across DST',()=>{
  assert.match(formatFlightDate('2027-01-30'),/subota/);
  assert.match(formatFlightDate('2027-02-04'),/četvrtak/);
  assert.equal(weekendRank(f('2027-03-27','2027-03-29',100)),0);
  assert.equal(tripNights(f('2027-03-27','2027-03-29',100)),2);
});
test('cheap badge threshold includes ties at the lowest fifth and handles empty results',()=>{
 assert.equal(cheapFlightThreshold([]),null);
 assert.equal(cheapFlightThreshold([{...f('2027-01-01','2027-01-03',1),available:false},f('2027-01-01','2027-01-03',10)]),10);
 assert.equal(cheapFlightThreshold([10,20,20,30,40,50,60,70,80,90].map(p=>f('2027-01-01','2027-01-03',p))),20);
});
test('weekend sorting prefers exact short pairs, extended weekend then other trips',()=>{
  const flights=[f('2027-01-05','2027-01-10',1000),f('2027-01-01','2027-01-03',5000),f('2027-01-02','2027-01-04',4000),f('2027-01-02','2027-01-03',7000),f('2027-01-01','2027-01-04',2000)];
  assert.deepEqual(sortFlightOptions(flights,'weekend').map(o=>o.index),[2,1,3,4,0]);
  assert.deepEqual(sortFlightOptions(flights).map(o=>o.index),[0,4,2,1,3]);
  assert.equal(sortFlightOptions(flights,'duration')[0].index,3);
  assert.equal(sortFlightOptions(flights,'date')[0].index,1);
  assert.equal(weekendRank(f('2027-01-02','2027-01-10',10)),2,'a longer trip sharing weekend weekdays is not a weekend break');
  const selected=new Set([1,3]);
  assert.deepEqual(sortFlightOptions(flights,'weekend').filter(o=>selected.has(o.index)).map(o=>o.flight.priceCents),[5000,7000]);
  assert.equal(flights[0].priceCents,1000,'sort must not mutate provider order or persisted indices');
});
