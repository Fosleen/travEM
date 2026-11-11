import test from 'node:test';
import strict from 'node:assert/strict';
import {once} from 'node:events';
// Must be set before dynamic imports: this test can ONLY use an in-memory DB.
process.env.NODE_ENV='test';process.env.DEAL_FINDER_TEST_DB='memory';
process.env.DEAL_FINDER_CMS_DRAFTS_ENABLED='true';
process.env.JWT_SECRET_KEY='offline-test-key-not-a-production-secret';
const {default:db}=await import('../app/models/index.js');
const {createAssociations}=await import('../database_management.js');
const service=await import('../app/services/dealFinder/service.js');
const {defaults}=await import('../app/services/dealFinder/domain.js');
const {default:express}=await import('express');
const {default:jwt}=await import('jsonwebtoken');
const {default:route}=await import('../app/routes/dealFinderRoute.js');
const {default:articleService}=await import('../app/services/articleService.js');

test('CMS workflow, permissions, dedupe, publication guard and zero API usage',async()=>{
 createAssociations();await db.sequelize.sync({force:true});
 const admin=await db.models.User.create({username:'admin',password:'unused',first_name:'A',last_name:'B',is_admin:1});
 const member=await db.models.User.create({username:'member',password:'unused',first_name:'C',last_name:'D',is_admin:0});
 const airport=await db.models.AirportCity.create({name:'Zagreb',iata_codes:['zag'],is_active:true});
 const category=await db.models.ArticleType.create({id:2,name:'Avio karte'});
 await service.saveSettings({...defaults},admin.id);
 strict.equal((await service.origins())[0].code,'ZAG');
 await db.models.AirportCity.create({name:'Skriveni',iata_codes:['VIE'],is_active:false});
 strict.equal((await service.origins()).length,1);
 await strict.rejects(()=>db.models.AirportCity.create({name:'Neispravan',iata_codes:['AB12']}));
 await strict.rejects(()=>db.models.AirportCity.create({name:'Duplikat',iata_codes:['ZAG','ZAG']}));
 const {default:airportService}=await import('../app/services/airportCityService.js');
 await strict.rejects(()=>airportService.updateAirportCity(airport.id,{iata_codes:['AB12']}));
 await airportService.updateAirportCity(airport.id,{iata_codes:[' zag ']});
 strict.equal((await service.origins())[0].code,'ZAG');
 const venice=await db.models.AirportCity.create({name:'Venecija',iata_codes:['VCE','TSF'],is_active:true});
 const veniceOrigins=(await service.origins()).filter(o=>o.id===venice.id);
 strict.deepEqual(veniceOrigins.map(o=>o.code),['VCE','TSF']);
 strict.ok(veniceOrigins.every(o=>o.name==='Venecija' && o.id===venice.id));
 await strict.rejects(()=>airportService.updateAirportCity(airport.id,{iata_codes:['TSF']}));
 const app=express();app.use(express.json());app.use('/deals',route);const server=app.listen(0,'127.0.0.1');await once(server,'listening');
 const base=`http://127.0.0.1:${server.address().port}/deals`;
 const call=async(path,body,user=admin)=>{
   const headers={'Content-Type':'application/json'};if(user)headers.Authorization=`Bearer ${jwt.sign({id:user.id},process.env.JWT_SECRET_KEY)}`;
   const response=await fetch(base+path,{method:body?'POST':'GET',headers,...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};
 };
 try {
  strict.equal((await call('/offers',null,null)).status,401);
  strict.equal((await call('/offers',null,member)).status,403);
  strict.equal((await call('/airports?q=JFK',null,null)).status,401);
  strict.equal((await call('/airports?q=JFK',null,member)).status,403);
  strict.equal((await call('/airports?q=JFK')).data[0].code,'JFK');
  strict.equal((await call('/search',{mode:'discover',origins:['XXX']})).status,400);
  // DB uniqueness is the cross-process idempotency barrier.
  await db.dealFinder.Run.create({key:'scheduled:2027-01-31',status:'completed'});
  await strict.rejects(()=>db.dealFinder.Run.create({key:'scheduled:2027-01-31'}));
  const live=await db.dealFinder.Offer.create({key:'synthetic:ZAG:ACE',origin:'ZAG',destination:'ACE',airportCityId:airport.id,status:'needs_verification',source:'manual',provenance:{},data:{flights:[{origin:'ZAG',destination:'ACE',departureDate:'2027-03-06',returnDate:'2027-03-09',priceCents:10100}],hotels:[]}});
  const listed=(await call('/offers')).data.find(o=>o.id===live.id);
  strict.equal(listed.originName,'Zagreb');strict.ok(listed.destinationName!=='ACE');
  const existingArticle=await db.models.Article.findOne();
  const disposable=await db.dealFinder.Offer.create({key:'delete-test',origin:'ZAG',destination:'ACE',status:'needs_verification',articleId:existingArticle?.id,provenance:{dismissedAt:'2026-01-01'},data:{flights:[],hotels:[]}});
  strict.ok((await call('/offers')).data.some(o=>o.id===disposable.id),'previously hidden offers can now be deleted');
  strict.equal((await call(`/offers/${disposable.id}/dismiss`,{},member)).status,403);
  strict.ok(await db.dealFinder.Offer.findByPk(disposable.id));
  strict.equal((await call(`/offers/${disposable.id}/dismiss`,{})).status,200);
  strict.equal(await db.dealFinder.Offer.findByPk(disposable.id),null);
  strict.ok(!(await call('/offers')).data.some(o=>o.id===disposable.id));
  strict.equal((await call(`/offers/${disposable.id}`)).status,400);
  strict.equal(await db.models.Article.count(),0);
  for(const [seller,priceEur,available] of [['Booking',101,false],['Kiwi',104,true],['Ryanair',108,true]])await service.verify(live.id,{kind:'flight',index:0,seller,priceEur,available,evidence:'Synthetic offline test'},admin.id);
  await live.reload();strict.equal(live.data.flights[0].priceCents,10400);strict.equal(live.data.flights[0].seller,'Kiwi');
  await service.select(live.id,{template:'monthly',month:'2027-03',flightIndices:[0]},admin.id);
  await service.buildContent(live.id,{provider:'template'},admin.id);
  const draft=await service.generateDraft(live.id,{articleTypeId:category.id},admin.id);
  strict.equal((await db.models.Article.findByPk(draft.articleId)).is_deal_draft,true);
  strict.equal((await call(`/offers/${live.id}/approve`,{confirm:false})).status,400);
  const another=await db.dealFinder.Offer.create({key:'synthetic:VIE:MLA',origin:'VIE',destination:'MLA',data:{flights:[{origin:'VIE',destination:'MLA',departureDate:'2027-03-01',returnDate:'2027-03-04',priceCents:5000}],hotels:[]},provenance:{}});
  await strict.rejects(()=>service.select(live.id,{template:'monthly',month:'2027-03',flightIndices:[0],additionalSelections:[{offerId:another.id,flightIndices:[0]}]},admin.id));
  const {SerpApiProvider}=await import('../app/services/dealFinder/providers.js');
  const provider=new SerpApiProvider(async()=>({deals:[{departure_airport_code:'XXX',arrival_airport_code:'MLA',price:10,outbound_date:'2027-01-30',return_date:'2027-02-04'}]}));
  strict.equal((await provider.search({mode:'discover',origins:['ZAG'],start:'2027-01-01',end:'2027-03-31',days:5,adults:1})).flights.length,0);
  const noQuotaRun=await db.dealFinder.Run.create({key:'quota',source:'manual',status:'queued',usage:0,input:{mode:'discover',origins:['ZAG'],start:'2027-01-01',end:'2027-03-31',days:5,adults:1}});
  const originalFetch=globalThis.fetch;let networkCalls=0;
  globalThis.fetch=async()=>{networkCalls++;throw new Error('Network is forbidden in this test');};
  try {await service.execute(noQuotaRun,{...defaults,monthlyCap:0},await service.origins(),admin.id);}finally{globalThis.fetch=originalFetch;}
  await noQuotaRun.reload();strict.equal(noQuotaRun.status,'failed');strict.equal(networkCalls,0);strict.match(noQuotaRun.error,/kvota/);
  const veniceOffers=[];
  for(const origin of ['VCE','TSF']) {
    const o=await db.dealFinder.Offer.create({key:`synthetic:${origin}:MLA`,origin,destination:'MLA',airportCityId:venice.id,status:'needs_verification',source:'manual',provenance:{},data:{flights:[{origin,destination:'MLA',departureDate:'2027-03-01',returnDate:'2027-03-04',priceCents:5000}],hotels:[]}});
    await service.select(o.id,{template:'monthly',month:'2027-03',flightIndices:[0]},admin.id);
    await service.buildContent(o.id,{provider:'template'},admin.id);
    const draft=await service.generateDraft(o.id,{articleTypeId:category.id},admin.id);
    strict.equal((await db.models.Article.findByPk(draft.articleId)).airportCityId,venice.id);
    veniceOffers.push(o);
  }
  await strict.rejects(()=>service.select(veniceOffers[0].id,{template:'monthly',month:'2027-03',flightIndices:[0],additionalSelections:[{offerId:veniceOffers[1].id,flightIndices:[0]}]},admin.id));
  const rangeFetch=globalThis.fetch;let rangeCalls=0;
  try {
    globalThis.fetch=async request=>{
      rangeCalls++;const params=new URL(request).searchParams;strict.equal(params.get('adults'),'1');
      const rows=rangeCalls===1?[
        ['2027-01-02','2027-01-07'],['2027-01-03','2027-01-10'],['2027-01-28','2027-02-02'],['2027-01-03','2027-01-04'],
      ]:[['2027-02-02','2027-02-03']];
      return {ok:true,json:async()=>({deals:rows.map(([departure,ret])=>({departure_airport_code:'ZAG',arrival_airport_code:'MLA',outbound_date:departure,return_date:ret,price:50}))})};
    };
    const january=await db.dealFinder.Run.create({key:'range-january',source:'manual',status:'queued',usage:0,input:{mode:'discover',origins:['ZAG'],start:'2027-01-01',end:'2027-01-31',minimumDays:5,adults:99}});
    await service.execute(january,await service.settings(),await service.origins(),admin.id);await january.reload();strict.equal(january.status,'completed');
    const route=await db.dealFinder.Offer.findOne({where:{key:'ZAG:MLA'}});strict.equal(route.data.flights.length,2);
    const february=await db.dealFinder.Run.create({key:'range-february',source:'manual',status:'queued',usage:0,input:{mode:'discover',origins:['ZAG'],start:'2027-02-01',end:'2027-02-28',minimumDays:1}});
    await service.execute(february,await service.settings(),await service.origins(),admin.id);await february.reload();strict.equal(february.status,'completed');
    await route.reload();strict.equal(route.data.flights.length,1);strict.equal(route.data.flights[0].departureDate,'2027-02-02');strict.equal(route.data.flightArchive.length,2);
  }finally{globalThis.fetch=rangeFetch;}
  const routeEnv={live:process.env.DEAL_FINDER_LIVE_ENABLED,key:process.env.SERPAPI_API_KEY};
  try {
    process.env.DEAL_FINDER_LIVE_ENABLED='true';process.env.SERPAPI_API_KEY='mock-only';
    const input={mode:'route',origins:['ZAG'],destination:'MLA',start:'2026-12-30',end:'2027-01-06',minimumDays:1};
    strict.equal(service.estimateQueries(input),7);
    strict.equal(service.estimateQueries({...input,mode:'discover',discoveryStrategy:'cheap_first'}),2);
    strict.equal(service.estimateQueries({...input,mode:'discover',discoveryStrategy:'cheap_first',origins:['ZAG','TSF']}),4);
    const active=await service.origins();
    strict.throws(()=>service.validateSearch({...input,mode:'discover',discoveryStrategy:'cheap_first'},{...defaults,enabled:true,maxQueries:1},active),/maksimalan/);
    strict.throws(()=>service.validateSearch(input,{...defaults,enabled:true,maxQueries:3},active),/maksimalan/);
    service.validateSearch(input,{...defaults,enabled:true,maxQueries:7},active);
    strict.throws(()=>service.validateSearch({...input,destination:'ZZZ'},{...defaults,enabled:true,maxQueries:7},active),/odredišni/);
    strict.throws(()=>service.validateSearch({...input,destination:'ZAG'},{...defaults,enabled:true,maxQueries:7},active),/odredišni/);
  }finally{
    for(const [key,value] of [['DEAL_FINDER_LIVE_ENABLED',routeEnv.live],['SERPAPI_API_KEY',routeEnv.key]]){if(value===undefined)delete process.env[key];else process.env[key]=value;}
  }
  const supplementalSettings=await service.settings(),supplementalEnv={live:process.env.DEAL_FINDER_LIVE_ENABLED,key:process.env.SERPAPI_API_KEY},supplementalFetch=globalThis.fetch;
  let supplementalCalls=0;
  try {
    await service.saveSettings({...supplementalSettings,enabled:true},admin.id);
    process.env.DEAL_FINDER_LIVE_ENABLED='true';process.env.SERPAPI_API_KEY='mock-only';
    const sourceWindow={start:'2026-12-01',end:'2026-12-31',minimumDays:1};
    const target=await db.dealFinder.Offer.create({key:'supplemental:ZAG:PFO',origin:'ZAG',destination:'PFO',airportCityId:airport.id,status:'ready_for_selection',source:'manual',selection:{flightIndices:[0]},data:{flights:[{origin:'ZAG',destination:'PFO',departureDate:'2026-12-04',returnDate:'2026-12-06',priceCents:5800}],hotels:[{name:'Saved hotel'}]},provenance:{discoveryWindow:sourceWindow,searchWindow:sourceWindow,editorInput:{title:'Moj naslov'}}});
    globalThis.fetch=async(url,options)=>{
      if(String(url).startsWith(base))return supplementalFetch(url,options);
      supplementalCalls++;const params=new URL(url).searchParams;strict.equal(params.get('arrival_id'),'PFO');strict.equal(params.get('departure_id'),'ZAG');strict.equal(params.get('adults'),'1');strict.equal(params.get('round_trip_days'),'2');
      return {ok:true,json:async()=>({prices:[{outbound_date:'2026-12-04',return_date:'2026-12-06',price:50},{outbound_date:'2026-12-11',return_date:'2026-12-13',price:43}]})};
    };
    const payload={mode:'calendar',days:2,confirmedQueries:1};
    strict.equal((await call(`/offers/${target.id}/search-flights`,payload,member)).status,403);
    strict.equal((await call(`/offers/${target.id}/search-flights`,{...payload,confirmedQueries:2})).status,400);
    strict.equal(supplementalCalls,0);
    strict.deepEqual((await call(`/offers/${target.id}`)).data.flightSearch.window,sourceWindow);
    const before=await service.budget(),request=await call(`/offers/${target.id}/search-flights`,{...payload,destination:'JFK',origins:['VIE']});
    strict.equal(request.status,200);
    const wait=async id=>{for(let i=0;i<100;i++){const run=await db.dealFinder.Run.findByPk(id);if(['completed','failed'].includes(run.status))return run;await new Promise(resolve=>setTimeout(resolve,5));}throw new Error('Mock run timeout');};
    const completed=await wait(request.data.id);strict.equal(completed.status,'completed');strict.equal(completed.usage,1);strict.equal(supplementalCalls,1);
    await target.reload();strict.equal(target.data.flights.length,2);strict.equal(target.data.flights[0].priceCents,5000);strict.deepEqual(target.selection.flightIndices,[0]);strict.equal(target.data.hotels[0].name,'Saved hotel');strict.equal(target.provenance.editorInput.title,'Moj naslov');strict.deepEqual(target.provenance.discoveryWindow,sourceWindow);
    strict.equal(target.provenance.lastFlightSearch.added,1);strict.equal(target.provenance.lastFlightSearch.updated,1);
    strict.equal((await service.budget()).used,before.used+1);
    const repeat=await call(`/offers/${target.id}/search-flights`,payload);strict.equal((await wait(repeat.data.id)).status,'completed');await target.reload();strict.equal(target.data.flights.length,2);
    await service.saveSettings({...await service.settings(),maxQueries:1},admin.id);
    strict.equal((await call(`/offers/${target.id}/search-flights`,{mode:'route',confirmedQueries:30})).status,400);
    strict.equal(supplementalCalls,2,'over-limit expansion never reaches the provider');
    const deleted=await db.dealFinder.Run.create({key:'supplemental-deleted',source:'manual',status:'queued',input:{...completed.input,offerId:target.id},usage:0});
    await target.destroy();await service.execute(deleted,await service.settings(),await service.origins(),admin.id);await deleted.reload();strict.equal(deleted.status,'failed');strict.equal(await db.dealFinder.Offer.findByPk(target.id),null,'deleted offer is not recreated by a late result');
  }finally{
    globalThis.fetch=supplementalFetch;await service.saveSettings(supplementalSettings,admin.id);
    for(const [key,value] of [['DEAL_FINDER_LIVE_ENABLED',supplementalEnv.live],['SERPAPI_API_KEY',supplementalEnv.key]]){if(value===undefined)delete process.env[key];else process.env[key]=value;}
  }
  const envKeys=['GROQ_API_KEY','GROQ_MODEL','DEAL_FINDER_AI_ENABLED'];
  const previousEnv=Object.fromEntries(envKeys.map(k=>[k,process.env[k]]));
  const previousFetch=globalThis.fetch;let aiCalls=0;
  try {
    await service.saveSettings({...await service.settings(),aiEnabled:true},admin.id);
    process.env.GROQ_API_KEY='offline-test-key';process.env.GROQ_MODEL='offline-model';process.env.DEAL_FINDER_AI_ENABLED='true';
    for(let i=0;i<12;i++)await service.audit(admin.id,'ai_request',{provider:'groq'});
    globalThis.fetch=async url=>{
      strict.equal(url,'https://api.groq.com/openai/v1/chat/completions');aiCalls++;
      return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify({titles:['Vrijeme je za odmor','Istraži novu destinaciju'],subtitles:['Odabrani letovi'],descriptions:['Odabrani termini za odmor.','Pripremi sljedeće putovanje.'],intro:'Isplaniraj boravak prema mjestima koja želiš istražiti.',tags:['putovanja','letovi']})}}]})};
    };
    await strict.rejects(()=>service.buildContent(live.id,{provider:'ai'},admin.id),/potvrđen/);strict.equal(aiCalls,0);
    await service.buildContent(live.id,{provider:'ai',confirmedAiRequest:true},admin.id);strict.equal(aiCalls,1);
    await service.buildContent(live.id,{provider:'ai',confirmedAiRequest:true},admin.id);strict.equal(aiCalls,2);
  } finally {globalThis.fetch=previousFetch;for(const k of envKeys){if(previousEnv[k]===undefined)delete process.env[k];else process.env[k]=previousEnv[k];}}
  // Approval publishes the article and permanently removes its offer in one transaction.
  // Tested only in this isolated in-memory database, never on a configured DB.
  strict.ok(await db.dealFinder.Offer.findByPk(live.id));
  strict.equal((await call(`/offers/${live.id}/approve`,{confirm:true})).status,200);
  strict.equal((await db.models.Article.findByPk(draft.articleId)).is_deal_draft,false);
  strict.equal(await db.dealFinder.Offer.findByPk(live.id),null);
  strict.ok(!(await call('/offers')).data.some(o=>o.id===live.id));
  const domestic=await db.dealFinder.Offer.create({key:'discovery:ZAG:SPU',origin:'ZAG',destination:'SPU',status:'needs_verification',provenance:{coverage:'discovery_highlights'},data:{flights:[],hotels:[]}});
  strict.ok(!(await call('/offers')).data.some(o=>o.id===domestic.id),'old domestic discovery is filtered too');
  // Priority applies before the list limit, and bulk deletion preserves CMS content and quota.
  for(const status of ['rejected','verified','needs_verification','ready_for_selection'])await db.dealFinder.Offer.create({key:`order:${status}`,origin:'ZAG',destination:'BSL',status,data:{flights:[],hotels:[]}});
  const ordered=(await call('/offers')).data;
  const position=status=>ordered.findIndex(o=>o.key===`order:${status}`);
  strict.ok(position('needs_verification')<position('verified'));
  strict.ok(position('ready_for_selection')<position('needs_verification'));
  strict.ok(position('verified')<position('rejected'));
  const beforeDelete=await db.dealFinder.Offer.count(),articlesBefore=await db.models.Article.count(),sectionsBefore=await db.models.Section.count(),budgetBefore=await service.budget();
  strict.equal((await call('/offers/delete-all',{confirm:true},null)).status,401);
  strict.equal((await call('/offers/delete-all',{confirm:true},member)).status,403);
  strict.equal((await call('/offers/delete-all',{})).status,400);
  strict.equal((await call('/offers/delete-all',{confirm:'true'})).status,400);
  strict.equal(await db.dealFinder.Offer.count(),beforeDelete);
  const deleted=await call('/offers/delete-all',{confirm:true});
  strict.equal(deleted.status,200);strict.equal(deleted.data.deleted,beforeDelete);
  strict.equal(await db.dealFinder.Offer.count(),0);
  strict.equal(await db.models.Article.count(),articlesBefore);strict.equal(await db.models.Section.count(),sectionsBefore);
  strict.deepEqual(await service.budget(),budgetBefore);
  strict.equal((await call('/offers/delete-all',{confirm:true})).data.deleted,0);
 } finally {await new Promise(resolve=>server.close(resolve));await db.sequelize.close();}
});
