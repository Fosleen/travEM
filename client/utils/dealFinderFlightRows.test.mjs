import test from 'node:test';
import assert from 'node:assert/strict';
import {flightSelectionRows,sortFlightSelectionRows,selectedDestinationCounts} from './dealFinderFlightRows.mjs';
import {sortFlightOptions} from './dealFinderFlights.mjs';

test('one flight table keeps saved indices and route identities while deduplicating candidates',()=>{
  const flight={origin:'DBV',destination:'STN',departureDate:'2026-12-04',returnDate:'2026-12-06',priceCents:10000};
  const flights=[flight,{...flight,destination:'KRK',priceCents:8000}];
  const candidates=[{...flight,id:'same',priceCents:7000},{...flight,destination:'DUB',id:'dub-expensive',priceCents:6000},{...flight,destination:'DUB',id:'dub-cheap',priceCents:5000},{...flight,departureDate:'2026-12-05',id:'short',priceCents:11000}];
  const rows=flightSelectionRows(flights,candidates);
  assert.equal(rows.length,4);
  assert.equal(rows[0].index,0);assert.equal(rows[1].index,1);
  assert.equal(rows[0].candidateId,null);assert.equal(rows[0].flight.priceCents,10000);
  assert.equal(rows[2].candidateId,'dub-cheap');assert.equal(rows[2].index,null);
  assert.equal(sortFlightOptions(rows.map(r=>r.flight),'price')[0].index,2);
  assert.equal(sortFlightOptions(rows.map(r=>r.flight),'duration')[0].index,3);
  for(const mode of ['price','duration','price_duration','weekend','date']){
    const sorted=sortFlightOptions(rows.map(r=>r.flight),mode);
    assert.deepEqual(sorted.map(r=>rows[r.index].index).filter(i=>i!==null).sort(),[0,1]);
  }
  assert.equal(flights.length,2);assert.equal(candidates.length,4);
});
test('confirmed prices lead in every mode; checkbox changes do not reorder flights',()=>{
  const base={origin:'DBV',destination:'STN',departureDate:'2026-12-04',returnDate:'2026-12-06',priceCents:5000};
  const rows=flightSelectionRows([
    {...base,priceCents:1000},
    {...base,destination:'DUB',priceCents:15000,verifiedAt:'2026-11-14T12:00:00Z'},
    {...base,destination:'KRK',priceCents:10000,reviewStatus:'verified'},
    {...base,destination:'BCN',priceCents:500,verifiedAt:'2026-11-14T12:00:00Z',available:false},
  ],[{...base,destination:'PRG',id:'candidate',priceCents:100}]);
  for(const mode of ['price','duration','price_duration','weekend','date']){
    const sorted=sortFlightSelectionRows(rows,mode);
    assert.deepEqual(sorted.slice(0,2).map(row=>row.index),[2,1]);
    rows[0].flight.selected=true;
    assert.deepEqual(sortFlightSelectionRows(rows,mode).map(row=>row.index),sorted.map(row=>row.index));
  }
  rows[0].flight.verifiedAt='2026-11-14T12:01:00Z';
  assert.equal(sortFlightSelectionRows(rows,'price')[0].index,0);
  assert.equal(rows[0].index,0);
});
test('destination counters count only selected source indices across every page',()=>{
  const flights=Array.from({length:60},(_,index)=>({destination:index%2?'STN':'KRK'}));
  assert.deepEqual(selectedDestinationCounts(flights,[0,2,28,58,3,3,999]),{KRK:4,STN:1});
  assert.deepEqual(selectedDestinationCounts(flights,[0,2,28]),{KRK:3});
  assert.deepEqual(selectedDestinationCounts(flights,[]),{});
});
