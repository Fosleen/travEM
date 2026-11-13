import test from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV='test';process.env.DEAL_FINDER_TEST_DB='memory';
const {default:db}=await import('../app/models/index.js');
const {createAssociations}=await import('../database_management.js');
const service=await import('../app/services/dealFinder/service.js');
const {defaults}=await import('../app/services/dealFinder/domain.js');
const {offerBatchSearchInput}=await import('../app/services/dealFinder/offerFlightSearch.js');

test('batch supplements bill the exact combined plan, isolate selected destinations and retain completed routes on failure',async()=>{
 createAssociations();await db.sequelize.sync({force:true});
 const oldFetch=globalThis.fetch,oldKey=process.env.SERPAPI_API_KEY;
 process.env.SERPAPI_API_KEY='mock';let calls=0,failDestination=null;
 const requested=[];
 const wait=async run=>{for(let i=0;i<300;i++){await run.reload();if(['completed','failed'].includes(run.status))return;await new Promise(r=>setTimeout(r,5));}assert.fail('Mock batch did not finish');};
 try{
  await service.saveSettings({...defaults,maxQueries:10},null);
  await db.models.AirportCity.bulkCreate([{name:'Zagreb',iata_codes:['ZAG'],is_active:true},{name:'Beč',iata_codes:['VIE'],is_active:true}]);
  const selected=['PRG','MLA','BGY','PFO','ACE'],all=[...selected,'BSL','JFK'];
  const flights=all.map((destination,index)=>({origin:'ZAG',destination,departureDate:'2026-12-03',returnDate:'2026-12-06',priceCents:10000+index*1000,stops:0,airlineCode:destination==='JFK'?'AA':'FR'}));
  const selection={template:'roundup',flightsOnly:true,flightIndices:[0,1,2],hotelIndex:null};
  const originalCandidate={id:'BSL:original',origin:'ZAG',destination:'BSL',departureDate:'2026-12-03',returnDate:'2026-12-06',priceCents:8000};
  const offer=await db.dealFinder.Offer.create({key:'batch-test',origin:'ZAG',destination:null,data:{type:'roundup',flights,hotels:[],flightCandidates:[originalCandidate]},selection,provenance:{discoveryWindow:{start:'2026-11-27',end:'2026-12-24',minimumDays:1},editorInput:{title:'Keep my article'}}});
  globalThis.fetch=async url=>{
   calls++;const p=new URL(url).searchParams;assert.equal(p.get('engine'),'google_flights_calendar');
   const destination=p.get('departure_id')==='ZAG'?p.get('arrival_id'):p.get('departure_id');requested.push(destination);
   if(destination===failDestination)return {ok:false,status:429};
   if(p.get('type')==='2')return {ok:true,json:async()=>({prices:p.get('departure_id')==='ZAG'?[{outbound_date:'2026-12-03',price:10},{outbound_date:'2026-12-04',price:12}]:[{outbound_date:'2026-12-06',price:15},{outbound_date:'2026-12-08',price:18}]})};
   assert.equal(destination,'JFK');return {ok:true,json:async()=>({prices:[{outbound_date:'2026-12-03',return_date:'2026-12-06',price:99}]})};
  };
  const request={destinations:selected,confirmedQueries:10};
  const plan=offerBatchSearchInput(offer,request,offer.provenance.discoveryWindow);
  assert.equal(service.estimateQueries(plan),10);assert.ok(plan.routes.every(r=>r.mode==='budget_dates'));
  for(const bad of [{...request,confirmedQueries:9},{destinations:[],confirmedQueries:0},{destinations:['PRG','PRG'],confirmedQueries:4},{destinations:['CDG'],confirmedQueries:2},{destinations:[...selected,'BSL'],confirmedQueries:12}])await assert.rejects(()=>service.searchOfferFlights(offer.id,bad,null));
  assert.equal(calls,0);assert.equal(await db.dealFinder.Run.count(),0);assert.equal((await service.budget()).used,0);
  await assert.rejects(()=>service.startSearch({...plan,origins:['VIE']},null),/polazištu/);
  await assert.rejects(()=>service.startSearch({...plan,routes:[{...plan.routes[0],destination:'CDG'},...plan.routes.slice(1)]},null),/Plan grupne/);assert.equal(calls,0);
  const run=await service.searchOfferFlights(offer.id,request,null);await wait(run);
  assert.equal(run.status,'completed',run.error);assert.equal(run.usage,10);assert.equal(calls,10);assert.equal((await service.budget()).used,10);
  assert.deepEqual(run.input.progress,{completed:5,total:5,completedDestinations:selected});
  assert.deepEqual(requested,selected.flatMap(code=>[code,code]));
  await offer.reload();assert.deepEqual(offer.data.flights,flights);assert.deepEqual(offer.selection,selection);assert.equal(offer.provenance.editorInput.title,'Keep my article');
  assert.equal(offer.data.flightCandidates.length,21);assert.deepEqual(offer.data.flightCandidates.find(c=>c.destination==='BSL'),originalCandidate);
  assert.equal(new Set(offer.data.flightCandidates.map(c=>c.id)).size,21);
  const mixed=await service.searchOfferFlights(offer.id,{destinations:['PRG','JFK','MLA'],legacyMode:'calendar',days:3,confirmedQueries:5},null);await wait(mixed);
  assert.equal(mixed.status,'completed',mixed.error);assert.equal(mixed.usage,5);assert.equal(calls,15);assert.deepEqual(mixed.input.routes.map(r=>r.mode),['budget_dates','calendar','budget_dates']);
  await offer.reload();assert.equal(offer.data.flights.find(f=>f.destination==='JFK').priceCents,9900);assert.equal(offer.data.flights.find(f=>f.destination==='PRG').priceCents,10000);
  const unchanged=JSON.stringify(offer.data.flightCandidates.filter(c=>['MLA','BGY','BSL'].includes(c.destination)));
  failDestination='MLA';const failed=await service.searchOfferFlights(offer.id,{destinations:['PRG','MLA','BGY'],confirmedQueries:6},null);await wait(failed);
  assert.equal(failed.status,'failed');assert.equal(failed.usage,3);assert.equal(calls,18);assert.match(failed.error,/Ranije spremljeni rezultati/);assert.match(failed.error,/nema automatskog ponavljanja/);
  assert.deepEqual(failed.input.progress,{completed:1,total:3,completedDestinations:['PRG']});
  await offer.reload();assert.equal(JSON.stringify(offer.data.flightCandidates.filter(c=>['MLA','BGY','BSL'].includes(c.destination))),unchanged);assert.deepEqual(offer.selection,selection);
  assert.equal((await service.budget()).used,18);assert.equal(await db.models.Article.count(),0);
  await service.saveSettings({...defaults,maxQueries:10,monthlyCap:18,reserve:0},null);
  const runs=await db.dealFinder.Run.count();await assert.rejects(()=>service.searchOfferFlights(offer.id,{destinations:['PRG'],confirmedQueries:2},null),/kvotu/);assert.equal(calls,18);assert.equal(await db.dealFinder.Run.count(),runs);
 }finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.SERPAPI_API_KEY;else process.env.SERPAPI_API_KEY=oldKey;await db.sequelize.close();}
});
