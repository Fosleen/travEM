import test from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV='test';process.env.DEAL_FINDER_TEST_DB='memory';
const {default:db}=await import('../app/models/index.js');
const {createAssociations}=await import('../database_management.js');
const service=await import('../app/services/dealFinder/service.js');
const {defaults}=await import('../app/services/dealFinder/domain.js');
const {normalizeSearch}=await import('../app/services/dealFinder/searchRules.js');
const {editorialFacts}=await import('../app/services/dealFinder/editorialFacts.js');

test('one-origin roundup preserves same-date destinations through discovery, supplements, AI and CMS transfer',async()=>{
 createAssociations();await db.sequelize.sync({force:true});
 const oldFetch=globalThis.fetch,keys=['SERPAPI_API_KEY','GROQ_API_KEY','DEAL_FINDER_AI_ENABLED'],old=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
 let searchCalls=0,aiCalls=0;
 const wait=async run=>{for(let i=0;i<200;i++){await run.reload();if(['completed','failed'].includes(run.status)){assert.equal(run.status,'completed',run.error);return;}await new Promise(r=>setTimeout(r,5));}assert.fail('Mock search did not complete');};
 try{
  process.env.SERPAPI_API_KEY='mock';process.env.GROQ_API_KEY='mock';process.env.DEAL_FINDER_AI_ENABLED='true';
  await service.saveSettings({...defaults,aiEnabled:true},null);
  const airport=await db.models.AirportCity.create({name:'Zagreb',iata_codes:['ZAG'],is_active:true});
  await db.models.AirportCity.create({name:'Beč',iata_codes:['VIE'],is_active:true});
  const input={mode:'discover',origins:['ZAG'],start:'2026-11-27',end:'2026-12-24',minimumDays:1,discoveryStrategy:'broad',combineDestinations:true};
  const active=await service.origins();
  assert.throws(()=>service.validateSearch(normalizeSearch({...input,origins:['ZAG','VIE']}),defaults,active),/jedno polazište/);
  assert.throws(()=>service.validateSearch(normalizeSearch({...input,mode:'route',destination:'PRG'}),defaults,active),/jedno polazište/);
  assert.throws(()=>service.validateSearch(normalizeSearch({...input,combineDestinations:'yes'}),defaults,active),/objedinjavanja/);
  assert.equal(service.estimateQueries(input),service.estimateQueries({...input,combineDestinations:false}));
  globalThis.fetch=async(url,request)=>{
   if(String(url).includes('api.groq.com')){
    aiCalls++;const facts=JSON.parse(JSON.parse(request.body).messages[1].content);
    assert.equal(facts.template,'roundup');assert.equal(facts.originName,'Zagreb');assert.equal(facts.destinations.length,4);assert.equal(facts.seasonalAngle,'Advent');assert.equal(facts.factsTokens.headline_price,'30€');assert.deepEqual(facts.hotels,[]);
    return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify({titles:['Jeftini povratni letovi iz Zagreba za Advent od {{headline_price}}'],subtitles:['Odaberi svoj Advent'],descriptions:['Pogledaj odabrane termine povratnih letova za različita odredišta i isplaniraj adventsko putovanje.'],intro:'Izdvojili smo ideje za adventsko putovanje.',tags:['Advent','Zagreb','povratni letovi','Prag','Malta'],sections:[{kind:'flights',subtitle:'Odabrani povratni letovi',text:'Usporedi odredišta i odaberi termin koji ti odgovara.'}]})}}]})};
   }
   searchCalls++;const params=new URL(url).searchParams,engine=params.get('engine');
   if(engine==='google_flights_deals')return {ok:true,json:async()=>({deals:[
    ...[['PRG',79,'FR'],['MLA',40,'FR'],['BGY',30,'FR'],['JFK',450,'AA']].map(([arrival_airport_code,price,airline_code])=>({departure_airport_code:'ZAG',arrival_airport_code,price,airline_code,airline:airline_code==='FR'?'Ryanair':'American Airlines',stops:0,outbound_date:'2026-12-21',return_date:'2026-12-24'})),
    {arrival_airport_code:'PRG',price:69,airline_code:'FR',airline:'Ryanair',stops:0,outbound_date:'2026-11-28',return_date:'2026-12-01'},
   ]})};
   assert.equal(engine,'google_flights_calendar');
   if(params.get('type')==='2')return {ok:true,json:async()=>({prices:params.get('departure_id')==='ZAG'?[{outbound_date:'2026-12-20',price:10},{outbound_date:'2026-12-21',price:12}]:[{outbound_date:'2026-12-24',price:15}]})};
   assert.equal(params.get('arrival_id'),'JFK');
   return {ok:true,json:async()=>({prices:[{outbound_date:'2026-12-21',return_date:'2026-12-24',price:400}]})};
  };
  const run=await service.startSearch(input,null);await wait(run);
  assert.equal(searchCalls,1);assert.equal(run.usage,1);assert.equal(await db.dealFinder.Offer.count(),1);
  const offer=await db.dealFinder.Offer.findOne();assert.equal(offer.destination,null);assert.equal(offer.data.type,'roundup');assert.equal(offer.data.flights.length,5);
  const detail=await service.detail(offer.id);assert.equal(detail.destinationName,'4 odredišta');assert.equal(detail.destinations.length,4);assert.equal(detail.flightSearch.routes.find(r=>r.destination==='JFK').airlineCodes.length,0);
  await assert.rejects(()=>service.searchOfferFlights(offer.id,{mode:'calendar',confirmedQueries:1},null),/Odaberi odredište/);
  await assert.rejects(()=>service.searchOfferFlights(offer.id,{destination:'CDG',mode:'calendar',confirmedQueries:1},null),/Odaberi odredište/);assert.equal(searchCalls,1);
  for(const destination of ['PRG','MLA'])await wait(await service.searchOfferFlights(offer.id,{destination,mode:'budget_dates',confirmedQueries:2},null));
  await offer.reload();assert.equal(offer.data.flightCandidates.length,4);assert.equal(new Set(offer.data.flightCandidates.map(c=>c.id)).size,4);
  for(const [destination,priceEur] of [['PRG',75],['MLA',53]]){
    const candidate=offer.data.flightCandidates.find(c=>c.destination===destination&&c.departureDate==='2026-12-21');
    await service.confirmFlightCandidate(offer.id,{candidateId:candidate.id,priceEur,airlineCode:'FR'},null);await offer.reload();
    assert.equal(offer.data.flights.length,5);
    assert.equal(offer.data.flights.find(f=>f.destination===destination&&f.departureDate==='2026-12-21').priceCents,priceEur*100);
  }
  await wait(await service.searchOfferFlights(offer.id,{destination:'JFK',mode:'calendar',days:3,confirmedQueries:1},null));await offer.reload();
  assert.equal(searchCalls,6);assert.equal(offer.data.flights.find(f=>f.destination==='JFK').priceCents,40000);assert.equal(offer.data.flights.find(f=>f.destination==='BGY').priceCents,3000);
  for(let index=0;index<offer.data.flights.length;index++)await service.verify(offer.id,{kind:'flight',index,quickPrice:true,priceEur:offer.data.flights[index].priceCents/100},null);
  await service.select(offer.id,{template:'roundup',flightIndices:[0,1,2,3,4],exampleIndex:0,hotelIndex:99,extraHotelIndices:[99],hostel:{url:'invalid'}},null);await offer.reload();
  assert.equal(offer.selection.flightsOnly,true);assert.equal(offer.selection.hotelIndex,null);assert.equal(offer.selection.hostel,null);
  const facts=editorialFacts(offer);assert.equal(facts.tokens.destination_count,'4');assert.equal(facts.context.travelWindow.start,'2026-11-28');assert.equal(facts.context.travelWindow.end,'2026-12-24');
  const template=await service.buildContent(offer.id,{provider:'template'},null);assert.ok(template.suggestions.titles.length>=5);assert.ok(template.suggestions.titles.some(t=>/iz Zagreba za Advent/.test(t)));
  const built=await service.buildContent(offer.id,{provider:'ai',confirmedAiRequest:true},null);assert.equal(aiCalls,1);assert.ok(built.suggestions.titles.some(t=>/iz Zagreba/.test(t)));assert.ok(built.suggestions.descriptions.every(d=>d.length<=100));
  const form=await service.articleForm(offer.id);assert.equal(form.values.article_airport_city_id,airport.id);assert.equal(form.values.article_video,'');assert.deepEqual(form.affiliateLinks,[]);
  const routes=form.values.sections.filter(s=>s.kind.startsWith('destination_'));assert.equal(routes.length,4);
  for(const section of routes){const code=section.kind.slice('destination_'.length);assert.match(section.section_text,new RegExp('destination='+code));for(const other of ['PRG','MLA','BGY','JFK'].filter(d=>d!==code))assert.doesNotMatch(section.section_text,new RegExp('destination='+other));}
  assert.equal(form.values.sections.filter(s=>s.required_notes).length,1);
  assert.equal(await db.models.Article.count(),0);assert.equal(await db.models.Section.count(),0);assert.equal(searchCalls,6);
  await wait(await service.startSearch({...input,combineDestinations:false},null));assert.equal(await db.dealFinder.Offer.count(),5);assert.equal(searchCalls,7);
 }finally{globalThis.fetch=oldFetch;for(const key of keys)if(old[key]===undefined)delete process.env[key];else process.env[key]=old[key];await db.sequelize.close();}
});
