import test from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV='test';process.env.DEAL_FINDER_TEST_DB='memory';
process.env.DEAL_FINDER_LIVE_ENABLED='true';process.env.SERPAPI_API_KEY='mock-only';
const {default:db}=await import('../app/models/index.js');
const {createAssociations}=await import('../database_management.js');
const service=await import('../app/services/dealFinder/service.js');
const {defaults}=await import('../app/services/dealFinder/domain.js');
test('two-call supplement isolates all estimates, preserves selections and promotes manually without API calls',async()=>{
  createAssociations();await db.sequelize.sync({force:true});
  await db.models.AirportCity.create({name:'Zagreb',iata_codes:['ZAG'],is_active:true});
  const flight={origin:'ZAG',destination:'ACE',departureDate:'2026-12-15',returnDate:'2026-12-22',priceCents:9500,airline:'Ryanair',airlineCode:'FR',stops:0};
  const window={start:'2026-12-01',end:'2026-12-31',minimumDays:1};
  const offer=await db.dealFinder.Offer.create({key:'ZAG:ACE',origin:'ZAG',destination:'ACE',data:{flights:[flight],hotels:[{name:'Keep me'}]},selection:{flightIndices:[0]},provenance:{discoveryWindow:window,editorInput:{title:'My title'}}});
  const original=globalThis.fetch;let calls=0;
  try{
    await service.saveSettings({...defaults,enabled:true,maxQueries:2},null);
    globalThis.fetch=async url=>{
      calls++;const p=new URL(url).searchParams;
      assert.equal(p.get('engine'),'google_flights_calendar');assert.equal(p.get('type'),'2');assert.equal(p.get('adults'),'1');assert.equal(p.has('include_airlines'),false);
      return {ok:true,json:async()=>({prices:p.get('departure_id')==='ZAG'?[{outbound_date:'2026-12-01',price:20},{outbound_date:'2026-12-12',price:30}]:[{outbound_date:'2026-12-15',price:20},{outbound_date:'2026-12-22',price:40}]})};
    };
    await assert.rejects(service.searchOfferFlights(offer.id,{mode:'oneway_pairs',confirmedQueries:2},null));
    await assert.rejects(service.searchOfferFlights(offer.id,{mode:'budget_dates',confirmedQueries:6},null));assert.equal(calls,0);
    const run=await service.searchOfferFlights(offer.id,{mode:'budget_dates',pairLimit:1,confirmedQueries:2},null);
    for(let i=0;i<200;i++){await run.reload();if(['completed','failed'].includes(run.status))break;await new Promise(resolve=>setTimeout(resolve,5));}
    assert.equal(run.status,'completed',run.error);assert.equal(run.usage,2);assert.equal(calls,2);assert.equal((await service.budget()).used,2);
    await offer.reload();assert.deepEqual(offer.data.flights,[flight]);assert.equal(offer.data.flightCandidates.length,4);assert.equal(offer.provenance.lastPairSearch.totalCombinations,4);
    assert.deepEqual(offer.selection,{flightIndices:[0]});assert.equal(offer.provenance.editorInput.title,'My title');assert.equal(offer.data.hotels[0].name,'Keep me');
    const next=await service.detail(offer.id);assert.equal(next.flightSearch.pairing.enabled,true);
    const candidate=next.data.flightCandidates[0],link=new URL(candidate.skyscannerUrl);assert.equal(link.searchParams.get('outboundDate'),'2026-12-01');assert.equal(link.searchParams.get('inboundDate'),'2026-12-15');assert.equal(link.searchParams.has('airlines'),false);assert.ok(link.searchParams.get('mediaPartnerId'));
    await assert.rejects(service.confirmFlightCandidate(offer.id,{candidateId:candidate.id},null));
    await service.confirmFlightCandidate(offer.id,{candidateId:candidate.id,priceEur:99},null);
    await offer.reload();assert.equal(offer.data.flights.length,2);assert.equal(offer.data.flights[1].priceCents,9900);assert.equal(offer.data.flights[1].airline,null);assert.equal(offer.data.flights[1].inboundStops,null);assert.equal(calls,2);assert.equal(offer.data.flightCandidates.length,3);
    await assert.rejects(service.verify(offer.id,{kind:'flight',index:0,quickPrice:true,priceEur:0},null));
    await service.verify(offer.id,{kind:'flight',index:0,quickPrice:true,priceEur:89,airlineCode:'W4'},null);
    await offer.reload();assert.equal(offer.data.flights[0].priceCents,8900);assert.equal(offer.data.flights[0].airline,'Wizz Air Malta');assert.equal(offer.data.flights[0].stops,0);assert.equal(calls,2);assert.deepEqual(offer.selection,{flightIndices:[0]});
    await service.verify(offer.id,{kind:'flight',index:0,quickPrice:true,priceEur:89,airlineCode:null},null);
    await offer.reload();assert.equal(offer.data.flights[0].airline,null);
    await service.confirmFlightCandidate(offer.id,{candidateId:offer.data.flightCandidates[0].id,priceEur:75},null);assert.equal(calls,2);
    assert.equal(await db.models.Article.count(),0);
    process.env.DEAL_FINDER_BUDGET_DATES_ENABLED='false';
    assert.deepEqual((await service.detail(offer.id)).data.flightCandidates,[]);
    await assert.rejects(service.searchOfferFlights(offer.id,{mode:'budget_dates',confirmedQueries:2},null));assert.equal(calls,2);
  }finally{delete process.env.DEAL_FINDER_BUDGET_DATES_ENABLED;globalThis.fetch=original;await db.sequelize.close();}
});
