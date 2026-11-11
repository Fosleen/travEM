import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultSearchWindow,changeSearchStart,searchWindowDays} from '../../client/utils/dealFinderSearch.mjs';
import {normalizeSearch,discoveryParams,matchesSearch,routeParams,routeQueryCount} from '../app/services/dealFinder/searchRules.js';
import {airportByCode,searchAirports,offerAirportNames} from '../app/services/dealFinder/airports.js';
import {SerpApiProvider} from '../app/services/dealFinder/providers.js';

test('search defaults to Zagreb today and next calendar day across month and DST changes',()=>{
  assert.deepEqual(defaultSearchWindow(new Date('2027-01-31T12:00:00Z')),{start:'2027-01-31',end:'2027-02-01'});
  assert.deepEqual(defaultSearchWindow(new Date('2027-03-27T23:30:00Z')),{start:'2027-03-28',end:'2027-03-29'});
  assert.deepEqual(defaultSearchWindow(new Date('2028-02-28T12:00:00Z')),{start:'2028-02-28',end:'2028-02-29'});
  assert.equal(searchWindowDays('2027-03-28','2027-03-29'),1);
  assert.equal(changeSearchStart({start:'2027-01-01',end:'2027-01-02'},'2027-01-10').end,'2027-01-11');
  assert.equal(changeSearchStart({start:'2027-01-01',end:'2027-01-31'},'2027-01-10').end,'2027-01-31');
});
test('flight duration is a minimum, bounded only by the requested travel window',()=>{
  const input=normalizeSearch({origins:['ZAG'],start:'2027-01-01',end:'2027-01-31',minimumDays:5,adults:8});
  const params=discoveryParams(input,'ZAG');
  assert.equal(params.trip_length,'5,30');assert.equal(params.outbound_date,'2027-01-01,2027-01-26');assert.equal(params.adults,1);
  assert.equal(params.return_date,undefined,'provider disallows return range combined with trip_length');
  assert.equal(discoveryParams({...input,minimumDays:1},'ZAG').trip_length,'1,30');
  const exact=discoveryParams({...input,start:'2027-01-01',end:'2027-01-02',minimumDays:1},'ZAG');
  assert.equal(exact.outbound_date,'2027-01-01');assert.equal(exact.return_date,'2027-01-02');assert.equal(exact.trip_length,undefined);
  assert.throws(()=>discoveryParams({...input,minimumDays:31},'ZAG'));
  assert.equal(normalizeSearch({mode:'hotels',adults:1}).adults,2);
  assert.equal(normalizeSearch({}).minimumDays,1);
});
test('one discovery request per origin covers multiple durations and filters both travel dates',async()=>{
  const calls=[];
  const provider=new SerpApiProvider(async(engine,params)=>{
    calls.push({engine,params});
    return {deals:[
      {arrival_airport_code:'JFK',price:100,outbound_date:'2027-01-02',return_date:'2027-01-03'},
      {arrival_airport_code:'JFK',price:200,outbound_date:'2027-01-02',return_date:'2027-01-07'},
      {arrival_airport_code:'JFK',price:220,start_date:'2027-01-03',end_date:'2027-01-10'},
      {arrival_airport_code:'JFK',price:50,outbound_date:'2026-12-31',return_date:'2027-01-06'},
      {arrival_airport_code:'JFK',price:50,outbound_date:'2027-01-28',return_date:'2027-02-02'},
    ]};
  });
  const input=normalizeSearch({mode:'discover',origins:['ZAG','VCE'],start:'2027-01-01',end:'2027-01-31',minimumDays:5});
  const result=await provider.search(input);
  assert.equal(calls.length,2);assert.ok(calls.every(c=>c.params.trip_length==='5,30'&&c.params.adults===1));
  assert.equal(result.flights.length,4);assert.deepEqual(new Set(result.flights.map(f=>f.origin)),new Set(['ZAG','VCE']));
  assert.ok(result.flights.every(f=>matchesSearch(f,input)));
  assert.equal(matchesSearch({departureDate:'2027-01-02',returnDate:'2027-01-03'},input),false);
});
test('hotel request and normalized room occupancy always use two adults',async()=>{
  const provider=new SerpApiProvider(async(engine,params)=>{
    assert.equal(engine,'booking');assert.equal(params.adults,2);
    return {properties:[{name:'Test',currency:'EUR',extracted_price:200}]};
  });
  const result=await provider.search({mode:'hotels',place:'Malta',checkin:'2027-01-02',checkout:'2027-01-07',adults:1,rooms:1,minRating:7});
  assert.equal(result.hotels[0].adults,2);
});

test('New Year minimum one includes longer trips; targeted route plans all outbound days explicitly',async()=>{
  const input=normalizeSearch({mode:'route',origins:['ZAG'],destination:'MLA',start:'2026-12-30',end:'2027-01-06',minimumDays:1,adults:5});
  assert.equal(routeQueryCount(input),7);
  const plan=[...routeParams(input,'ZAG')];
  assert.equal(plan[0].date_range_start,'2026-12-30');assert.equal(plan.at(-1).date_range_start,'2027-01-05');
  assert.ok(plan.every(p=>p.fixed_outbound_date===true&&p.round_trip_days===undefined&&p.date_range_end==='2027-01-06'&&p.adults===1));
  const calls=[];
  const provider=new SerpApiProvider(async(engine,params)=>{
    calls.push(params);assert.equal(engine,'google_flights_calendar');
    const outbound_date=params.date_range_start;
    return {prices:[
      {outbound_date,return_date:outbound_date,price:20},
      {outbound_date,return_date:'2027-01-05',price:40},
      {outbound_date,return_date:'2027-01-06',price:50},
      {outbound_date,return_date:'2027-01-07',price:60},
    ]};
  });
  const result=await provider.search(input);
  assert.equal(calls.length,7);assert.equal(result.flights.length,13);
  assert.ok(result.flights.some(f=>f.departureDate==='2026-12-30'&&f.returnDate==='2027-01-06'));
  assert.ok(result.flights.every(f=>matchesSearch(f,input)&&f.destination==='MLA'));
  assert.equal(routeQueryCount({...input,minimumDays:5}),3);
  const one=await provider.search({...input,start:'2027-01-05'});
  assert.equal(one.flights.length,1);assert.equal(one.flights[0].returnDate,'2027-01-06');
});

test('local airport catalog finds codes, cities, Croatian aliases and multiple airports without network',()=>{
  assert.equal(searchAirports('jfk')[0].code,'JFK');
  assert.equal(searchAirports('London').filter(a=>['LHR','LGW','STN'].includes(a.code)).length,3);
  assert.ok(searchAirports('Venecija').some(a=>a.code==='VCE'));
  assert.ok(searchAirports('Venecija').some(a=>a.code==='TSF'));
  assert.ok(searchAirports('bec').some(a=>a.code==='VIE'),'an exact BEC airport code still ranks before the Beč city alias');
  assert.equal(searchAirports('x').length,0);
  assert.equal(airportByCode('ZZZ'),null);
  assert.equal(offerAirportNames({origin:'TSF',destination:'MLA'},[{code:'TSF',name:'Venecija'}]).originName,'Venecija');
  assert.equal(offerAirportNames({origin:'ZAG',destination:'MLA'}).destinationName,'Malta');
  for(const [code,name] of [['BSL','Basel'],['CRL','Brussels Charleroi'],['BGY','Milan Bergamo']]) {
    assert.equal(searchAirports(code)[0].city,name);
    assert.equal(offerAirportNames({origin:'ZAG',destination:code}).destinationName,name);
  }
});
