import { randomUUID } from 'node:crypto';
import {Op} from 'sequelize';
import db from '../../models/index.js';
import { normalizeSettings, assert, validateSettings, validateOverrides, effectiveSettings, nights, evaluateStay, renderHostel, escapeHtml, cents, scheduleKey, stayTotal } from './domain.js';
import { SerpApiProvider } from './providers.js';
import {aiConfigured,groqModel,GroqTextGenerator,templateEditorial} from './textGeneration.js';
import {normalizeSearch,matchesSearch,dateSpan,routeQueryCount,discoveryQueryCount} from './searchRules.js';
import {airportByCode,offerAirportNames} from './airports.js';
import {sourceSearchWindow,offerFlightSearchInput,offerBatchSearchInput,mergeOfferFlights} from './offerFlightSearch.js';
import {budgetCarrierCodes,budgetDatesEnabled,confirmedPairFlight} from './budgetDates.js';
import {skyscanner,hotelBookingLink} from './domain.js';
import { createUniqueArticleSlug } from '../../utils/articleSlug.js';
import {orderedRows} from './orderedRows.js';
import {storedHotelForDisplay,recoverStoredHotelFeatures} from './hotels.js';
import {editorialFacts,editorialSnapshot,flightForStay} from './editorialFacts.js';
import {validateSections,articleSections,renderArticleSections,defaultSectionIcon} from './editorialDraft.js';
import {renderFlightNotes,fareChangeNotice} from './baggage.js';
import {articleAutomation} from './articleAutomation.js';
import {isRoundupOffer,flightKey,destinationCodes,routeOffer} from './roundup.js';
async function editorialIcons(){return (await db.models.SectionIcon.findAll({where:{feature_key:null},attributes:['id','url'],order:[['id','ASC']]})).map(i=>i.toJSON());}
function checkSectionIcons(sections,icons){for(const section of sections||[])assert(section.sectionIconId===null||icons.some(i=>i.id===section.sectionIconId),'Ikonica odlomka nije dostupna');}
const models=()=>db.dealFinder;
export async function settings() { return normalizeSettings((await models().Setting.findByPk(1))?.value); }
export async function audit(userId,action,payload,transaction) { return models().Audit.create({userId,action,payload},{transaction}); }
export async function saveSettings(value,userId) {
  const s=validateSettings(value);
  await db.sequelize.transaction(async transaction=>{
    await models().Setting.upsert({id:1,value:s},{transaction});
    await audit(userId,'settings',s,transaction);
  }); return s;
}
export async function origins() {
  const cities=await db.models.AirportCity.findAll({where:{is_active:true},order:[['display_order','ASC'],['name','ASC']]});
  const result=cities.flatMap(a=>(a.iata_codes?.length?a.iata_codes:[null])
    .map(code=>({id:a.id,name:a.name,code,flagUrl:a.flag_url})));
  const codes=result.map(a=>a.code).filter(Boolean);
  assert(new Set(codes).size===codes.length,'Isti IATA kod pridružen je različitim polazištima. Provjerite popis aerodroma.');
  return result;
}
export async function budget() {
  const id=new Date().toISOString().slice(0,7),s=await settings(),used=(await models().Budget.findByPk(id))?.used||0,limit=Math.min(s.monthlyCap,250-s.reserve);
  return {month:id,used,limit,remaining:Math.max(0,limit-used)};
}
async function reserve(s,run) {
  const id=new Date().toISOString().slice(0,7);
  await models().Budget.findOrCreate({where:{id},defaults:{used:0}});
  await db.sequelize.transaction(async transaction=>{
    const row=await models().Budget.findByPk(id,{transaction,lock:transaction.LOCK.UPDATE});
    assert(row.used<Math.min(s.monthlyCap,250-s.reserve),'Mjesečna kvota je potrošena');
    assert(run.usage<s.maxQueries,'Dosegnut maksimalan broj upita');
    await row.increment('used',{transaction});
    await run.increment('usage',{transaction});
  });
  await run.reload();
}
export function validateSearch(input,s,active) {
  assert(['discover','route','calendar','hotels','budget_dates','batch_routes'].includes(input.mode),'Nepoznat način pretrage');
  if(input.mode==='batch_routes')assert(input.supplemental===true&&Array.isArray(input.routes)&&input.routes.length>0&&input.routes.length<=90&&input.routes.every(r=>['calendar','route','budget_dates'].includes(r.mode)),'Neispravan plan grupne dopune');
  if(input.mode==='budget_dates')assert(budgetDatesEnabled()&&input.supplemental===true,'Budget dopuna nije uključena');
  assert(Array.isArray(input.origins) && input.origins.length>0 && input.origins.length<=12,'Odaberite 1–12 polazišta');
  assert(input.origins.every(c=>active.some(a=>a.code===c)),'Polazište nije aktivno ili nema IATA kod u popisu aerodroma');
  if(input.combineDestinations!==undefined)assert(typeof input.combineDestinations==='boolean','Neispravna opcija objedinjavanja odredišta');
  if(input.combineDestinations)assert(input.mode==='discover'&&input.origins.length===1&&!input.supplemental,'Objedinjena ponuda zahtijeva otkrivanje destinacija i jedno polazište');
  validateOverrides(input.overrides);
  if(input.durations) assert(Array.isArray(input.durations) && input.durations.length>0 && input.durations.every(n=>Number.isInteger(n) && n>=1 && n<=60),'Trajanja moraju biti cijeli brojevi 1–60');
  assert(estimateQueries(input)<=s.maxQueries,'Pretraga prelazi maksimalan broj upita');
  {
    assert(process.env.SERPAPI_API_KEY,'SerpApi ključ nije konfiguriran');
    const span=dateSpan(input.start,input.end);
    if(['discover','route'].includes(input.mode))assert(Number.isInteger(input.minimumDays)&&input.minimumDays>=1&&input.minimumDays<=span,'Minimalno trajanje mora stati u odabrani raspon datuma');
    if(input.mode==='route')assert(airportByCode(input.destination)&&!input.origins.includes(input.destination),'Odaberite odredišni aerodrom različit od polazišta');
    if(input.mode==='calendar')assert(Number.isInteger(input.days)&&input.days>=1,'Neispravno trajanje kalendara');
    if(input.mode==='calendar') assert(/^[A-Z]{3}$/.test(input.destination),'Odaberite destinaciju');
    if(input.mode==='hotels') { nights(input.checkin,input.checkout);assert(input.place && input.offerId,'Odaberite ponudu i mjesto');assert(Number.isInteger(input.rooms)&&input.rooms>=1&&input.rooms<=4,'Broj soba mora biti 1–4'); }
  }
}
export function estimateQueries(input) { return input.mode==='batch_routes'?input.routes.reduce((sum,route)=>sum+estimateQueries(route),0):input.mode==='budget_dates'?2:input.mode==='hotels'?1:input.origins.length*(input.mode==='oneway_pairs'?2:input.mode==='route'?routeQueryCount(input):input.mode==='calendar'?(input.durations?.length||1):discoveryQueryCount(input)); }
async function originalWindow(offer) {
  const stored=sourceSearchWindow(offer);if(stored)return stored;
  const parent=offer.provenance?.runId?await models().Run.findByPk(offer.provenance.runId):null;
  return sourceSearchWindow(offer,parent?.input);
}
async function pendingOfferSearch(id) {
  const runs=await orderedRows(models().Run,{where:{status:{[Op.in]:['queued','running']}},order:[['createdAt','DESC'],['id','DESC']],limit:100});
  return runs.find(run=>run.input?.supplemental===true&&Number(run.input.offerId)===Number(id));
}
export async function searchOfferFlights(id,options,userId) {
  const offer=await models().Offer.findByPk(id);assert(offer,'Ponuda ne postoji');
  const window=await originalWindow(offer);
  const input=options.destinations!==undefined?offerBatchSearchInput(offer,options,window):offerFlightSearchInput(routeOffer(offer,options.destination),options,window);
  assert(options.confirmedQueries===estimateQueries(input),'Potvrdite prikazani broj dodatnih API upita');
  assert(!await pendingOfferSearch(id),'Dodatna pretraga ove ponude već je u tijeku');
  return startSearch(input,userId);
}
export async function startSearch(input,userId,{key,source='manual'}={}) {
  input=normalizeSearch(input);
  const s=await settings(), active=await origins(s); validateSearch(input,s,active);
  {
    const b=await budget(), estimate=estimateQueries(input);
    assert(b.used+estimate<=Math.min(s.monthlyCap,250-s.reserve),'Planirani upiti prelaze preostalu mjesečnu kvotu');
  }
  if(input.mode==='hotels') {
    const o=await models().Offer.findByPk(input.offerId);
    assert(o && input.origins.includes(o.origin),'Odaberite live ponudu iz odabranog polazišta');
    assert(!isRoundupOffer(o),'Objedinjena ponuda namijenjena je pregledu letova bez smještaja');
  }
  if(input.mode==='batch_routes'){
    const offer=await models().Offer.findByPk(input.offerId);assert(offer,'Ponuda ne postoji');
    assert(input.origins.length===1&&input.origins[0]===offer.origin,'Grupna dopuna mora ostati na polazištu ponude');
    const expected=offerBatchSearchInput(offer,input,await originalWindow(offer));
    assert(JSON.stringify(input.routes)===JSON.stringify(expected.routes),'Plan grupne dopune promijenjen je; osvježi ponudu');
    for(const route of input.routes)validateSearch(route,s,active);
  }else if(input.supplemental===true) {
    const stored=await models().Offer.findByPk(input.offerId),offer=stored&&routeOffer(stored,input.destination);
    assert(offer&&['calendar','route','budget_dates'].includes(input.mode)&&input.origins.length===1&&input.origins[0]===offer.origin&&input.destination===offer.destination,'Dodatne termine možete tražiti samo na ruti postojeće live ponude');
    if(budgetCarrierCodes(offer).length)assert(input.mode==='budget_dates','Za budget rutu koristite filtar prijevoznika');
    if(input.mode==='budget_dates'){
      const expected=offerFlightSearchInput(offer,input,await originalWindow(offer));
      assert(input.calendarPairVersion===2&&JSON.stringify(input.airlineCodes)===JSON.stringify(expected.airlineCodes),'Plan se promijenio; ponovno otvorite ponudu');
    }
  }
  const [run,created]=await models().Run.findOrCreate({where:{key:key||`manual:${randomUUID()}`},defaults:{source,status:'queued',input,usage:0}});
  if(!created) return run;
  // Persist first. API handler returns immediately; exceptions are recorded in the run.
  setImmediate(()=>execute(run,s,active,userId).catch(()=>{}));
  return run;
}
async function saveSupplementResult(result,input,runId){
  await db.sequelize.transaction(async transaction=>{
    const offer=await models().Offer.findByPk(input.offerId,{transaction,lock:transaction.LOCK.UPDATE});
    assert(offer,'Ponuda je uklonjena; rezultati nisu spremljeni');
    const flights=result.flights.filter(f=>f.origin===offer.origin&&f.destination===input.destination&&matchesSearch(f,input));
    if(input.mode==='budget_dates'){
      const candidates=isRoundupOffer(offer)?[
        ...(offer.data.flightCandidates||[]).filter(c=>c.destination!==input.destination),
        ...result.candidates.map(c=>({...c,id:`${c.destination}:${c.id}`})),
      ]:result.candidates;
      await offer.update({data:{...offer.data,flightCandidates:candidates},provenance:{...offer.provenance,lastPairSearch:{runId,start:input.start,end:input.end,minimumDays:input.minimumDays,totalCombinations:result.metadata.totalCombinations,at:new Date().toISOString()}}},{transaction});
    }else await offer.update(mergeOfferFlights(offer,flights,{id:runId,input}),{transaction});
  });
}

export async function execute(run,s,active,userId) {
  try {
    await run.update({status:'running'}); const input=normalizeSearch(run.input);
    assert(input.mode!=='oneway_pairs','Staro kombiniranje nefiltriranih kalendara je isključeno');
    if(input.mode==='budget_dates')assert(input.calendarPairVersion===2,'Stari plan dopune više ne vrijedi; pokrenite novu pretragu raspona');
    if(input.mode==='batch_routes'){
      const offer=await models().Offer.findByPk(input.offerId);assert(offer,'Ponuda je uklonjena; dopuna nije pokrenuta');
      assert(input.origins.length===1&&input.origins[0]===offer.origin,'Grupna dopuna mora ostati na polazištu ponude');
      const expected=offerBatchSearchInput(offer,input,await originalWindow(offer));
      assert(JSON.stringify(input.routes)===JSON.stringify(expected.routes),'Plan grupne dopune promijenjen je; osvježi ponudu');
      validateSearch(input,s,active);
    }else if(input.supplemental===true) {
      const stored=await models().Offer.findByPk(input.offerId),offer=stored&&routeOffer(stored,input.destination);
      assert(offer&&input.origins.length===1&&offer.origin===input.origins[0]&&offer.destination===input.destination,'Ponuda je uklonjena ili ruta nije valjana; pretraga nije pokrenuta');
      if(input.mode==='budget_dates')assert(budgetDatesEnabled()&&JSON.stringify(budgetCarrierCodes(offer))===JSON.stringify(input.airlineCodes),'Budget pretraga je isključena ili su se prijevoznici promijenili');
    }
    const provider=new SerpApiProvider(async(engine,params)=>{
      await reserve(s,run);
      const u=new URL('https://serpapi.com/search.json');
      u.search=new URLSearchParams({...params,engine,api_key:process.env.SERPAPI_API_KEY}).toString();
      let response; try {response=await fetch(u,{signal:AbortSignal.timeout(60000)});} catch {throw new Error('SerpApi mrežna pogreška ili timeout; nema automatskog ponavljanja');}
      assert(response.ok,`SerpApi HTTP ${response.status}; ponovite ručno nakon provjere kvote`);
      const data=await response.json();assert(!data.error,'SerpApi je odbio upit; provjerite račun i parametre');return data;
    });
    if(input.mode==='batch_routes'){
      const completedDestinations=[];
      for(const route of input.routes){
        const offer=await models().Offer.findByPk(input.offerId);assert(offer,'Ponuda je uklonjena; preostale rute nisu pretražene');
        const expected=offerFlightSearchInput(routeOffer(offer,route.destination),route,await originalWindow(offer));
        assert(JSON.stringify(route)===JSON.stringify(expected),'Ruta je promijenjena tijekom dopune; preostali upiti nisu pokrenuti');
        const result=await provider.search({...route,minRating:s.minRating});
        await saveSupplementResult(result,route,run.id);
        completedDestinations.push(route.destination);
        await run.update({input:{...run.input,progress:{completed:completedDestinations.length,total:input.routes.length,completedDestinations:[...completedDestinations]}}});
      }
      await run.update({status:'completed'});await audit(userId,'search_completed',{runId:run.id});return;
    }
    const result=await provider.search({...input,minRating:s.minRating,cheapDiscoveryMaxEur:s.cheapDiscoveryMaxEur});
    if(input.supplemental===true)await saveSupplementResult(result,input,run.id);
    const groups=new Map();
    for(const f of input.supplemental===true?[]:result.flights) {
      if(!input.origins.includes(f.origin)||!matchesSearch(f,input)) continue;
      const key=input.combineDestinations?`roundup:${f.origin}:${run.id}`:`${f.origin}:${f.destination}`;
      if(!groups.has(key)) groups.set(key,[]);groups.get(key).push(f);
    }
    for(const [key,flights] of groups) {
      await db.sequelize.transaction(async transaction=>{
        const [o]=await models().Offer.findOrCreate({where:{key},defaults:{origin:flights[0].origin,destination:input.combineDestinations?null:flights[0].destination,airportCityId:active.find(a=>a.code===flights[0].origin).id,status:'needs_verification',source:run.source,data:{flights:[],hotels:[],...(input.combineDestinations?{type:'roundup'}:{})}},transaction});
        await o.reload({transaction,lock:transaction.LOCK.UPDATE});
        const merged=new Map([...(o.data.flightArchive||[]),...(o.data.flights||[])].map(f=>[flightKey(f),f]));
        for(const f of flights) merged.set(flightKey(f),{...f,priceHistory:[...(merged.get(flightKey(f))?.priceHistory||[]),{priceCents:f.priceCents,at:new Date().toISOString()}].slice(-20)});
        const matchingFlights=[],flightArchive=[];
        for(const flight of merged.values())(matchesSearch(flight,input)?matchingFlights:flightArchive).push(flight);
        const window={start:input.start,end:input.end,minimumDays:input.minimumDays};
        await o.update({selection:null,data:{...o.data,destinationName:flights[0].destinationName||o.data.destinationName,flights:matchingFlights,flightArchive,hotels:o.data.hotels},provenance:{...o.provenance,...result.metadata,...(input.mode==='discover'?{discoveryWindow:window}:{}),dismissedAt:null,searchWindow:window,overrides:input.overrides||{},lastSeenAt:new Date().toISOString(),runId:run.id}},{transaction});
      });
    }
    if(input.mode==='hotels') {
      const o=await models().Offer.findByPk(input.offerId);assert(o,'Ponuda ne postoji');
      await o.update({data:{...o.data,hotels:result.hotels},provenance:{...o.provenance,hotelSearch:result.metadata}});
    }
    await run.update({status:'completed'}); await audit(userId,'search_completed',{runId:run.id});
  } catch(e) { await run.update({status:'failed',error:run.input?.mode==='batch_routes'?`${e.message}. Ranije spremljeni rezultati ruta ostaju u ponudi; nema automatskog ponavljanja.`:e.message}); }
}
export async function detail(id) {
  const o=await models().Offer.findByPk(id);assert(o,'Ponuda ne postoji');
  const s=await settings(), effective=effectiveSettings(s,o.destination,o.provenance?.overrides);
  const hotels=(await recoverStoredHotelFeatures(o.data.hotels||[])).map(storedHotelForDisplay).map(h=>{
    let bookingAffiliateUrl=null;try{bookingAffiliateUrl=hotelBookingLink(h,s);}catch{/* A missing or invalid provider link must not hide the offer. */}
    return {...h,bookingAffiliateUrl,evaluation:evaluateStay(h,effective)};
  });
  const hotelRanking=hotels.map((h,index)=>({index,...h.evaluation})).sort((a,b)=>a.reasons.length-b.reasons.length || b.rank-a.rank).map(h=>h.index);
  const flights=o.data.flights.map(f=>({...f,destinationName:airportByCode(f.destination)?.city||f.destinationName||f.destination,destinationCountry:airportByCode(f.destination)?.country,skyscannerUrl:skyscanner(f,s),reviewStatus:f.available===false?'unavailable':f.verifiedAt?'verified':'unverified'}));
  const routes=isRoundupOffer(o)?destinationCodes(o).map(destination=>({destination,airlineCodes:budgetCarrierCodes(routeOffer(o,destination))})):undefined;
  const airlineCodes=budgetCarrierCodes(o),pairing={enabled:budgetDatesEnabled(),eligible:airlineCodes.length>0};
  const candidates=pairing.enabled?(o.data.flightCandidates||[]).map(c=>({...c,destinationName:airportByCode(c.destination)?.city||c.destination,skyscannerUrl:skyscanner(c,s)})):[];
  return {...offerAirportNames(o,await origins()),sectionIcons:await editorialIcons(),flightSearch:{...(routes?{routes}:{}),window:await originalWindow(o),maxQueries:s.maxQueries,budget:await budget(),budgetDates:{enabled:budgetDatesEnabled(),airlineCodes},pairing,pendingRunId:(await pendingOfferSearch(id))?.id||null,enabled:Boolean(process.env.SERPAPI_API_KEY)},capabilities:{cmsDraftsEnabled:process.env.DEAL_FINDER_CMS_DRAFTS_ENABLED==='true',aiConfigured:aiConfigured(s)},effectiveSettings:effective,hotelRanking,data:{...o.data,hotels,flights,flightCandidates:candidates}};
}
export async function confirmFlightCandidate(id,input,userId) {
  assert(budgetDatesEnabled(),'Kombiniranje je isključeno');
  return db.sequelize.transaction(async transaction=>{
    const offer=await models().Offer.findByPk(id,{transaction,lock:transaction.LOCK.UPDATE});assert(offer,'Ponuda nije prihvatljiva');
    const candidate=(offer.data.flightCandidates||[]).find(c=>c.id===input.candidateId);assert(candidate,'Kombinacija ne postoji');
    const flight=confirmedPairFlight(candidate,input),flights=[...offer.data.flights];
    const index=flights.findIndex(f=>flightKey(f)===flightKey(flight));
    if(index===-1)flights.push(flight);else flights[index]=flight;
    await offer.update({data:{...offer.data,flights,flightCandidates:offer.data.flightCandidates.filter(c=>c.id!==candidate.id)}},{transaction});
    await audit(userId,'confirm_low_cost_pair',{offerId:offer.id,candidateId:candidate.id,priceCents:flight.priceCents},transaction);
    return {index:index===-1?flights.length-1:index};
  });
}
export function validateManualFields(fields={}) {
  assert(fields&&typeof fields==='object'&&!Array.isArray(fields),'Neispravna urednička polja');
  const result={};
  for(const [key,max] of [['title',100],['subtitle',100],['description',100],['intro',10000],['tags',255]]) {
    if(fields[key]!==undefined){assert(typeof fields[key]==='string'&&fields[key].length<=max,`Polje ${key} smije imati najviše ${max} znakova`);result[key]=fields[key];}
  }
  if(fields.sections!==undefined)result.sections=validateSections(fields.sections);
  return result;
}
export async function buildContent(id,input,userId) {
  const o=await models().Offer.findByPk(id);assert(o?.selection,'Najprije spremite odabir letova i smještaja');
  const s=await settings(),flights=await selectedFlights(o);
  const displayOffer={...o.toJSON(),data:{...o.data,hotels:(await recoverStoredHotelFeatures(o.data.hotels||[])).map(storedHotelForDisplay)}};
  const hotel=o.selection.template==='monthly'?null:displayOffer.data.hotels[o.selection.hotelIndex];
  assert(['manual','template','ai'].includes(input.provider),'Odaberite način pripreme članka');
  const fields=validateManualFields(input.fields);
  const icons=await editorialIcons();checkSectionIcons(fields.sections,icons);
  let suggestions=null;
  const snapshot=editorialSnapshot(o);
  if(input.provider==='ai') {
    assert(input.confirmedAiRequest===true&&aiConfigured(s),'AI nije omogućen ili nije potvrđen ručni AI upit');
    const aiOffer={...displayOffer,effectiveSettings:s,selection:{...o.selection,flightIndices:flights.map((_,i)=>i)},data:{...displayOffer.data,flights,destinationName:({MLA:'Malta',FCO:'Rim',CIA:'Rim'}[o.destination]||o.data.destinationName||o.destination)}};
    const facts=editorialFacts(aiOffer);
    assert(!facts.context.hotels.length||facts.context.hotels[0].totalPriceCents!==null,'Najprije potvrdi ukupnu cijenu glavnog smještaja');
    assert(!facts.context.hotels.length||facts.tokens.package_price_short,'Za datume odabranog smještaja nema spremljenog povratnog leta s cijenom');
    assert(facts.tokens.headline_price,'Najprije potvrdi cijenu odabranog leta za naslov članka');
    await audit(userId,'ai_request',{offerId:id,provider:'groq',model:groqModel()});
    try {suggestions=await new GroqTextGenerator().generate(aiOffer);}
    catch(error){await audit(userId,'ai_failed',{offerId:id});throw new Error(error.name==='TimeoutError'?'AI timeout; nema automatskog ponavljanja':error.message);}
  } else if(input.provider==='template') suggestions=templateEditorial({...o.toJSON(),effectiveSettings:effectiveSettings(s,o.destination,o.provenance?.overrides)});
  const current=await models().Offer.findByPk(id);
  assert(JSON.stringify(current.selection)===JSON.stringify(o.selection),'Odabir je promijenjen tijekom pripreme; osvježite ponudu');
  if(input.provider==='ai')assert(editorialSnapshot(current)===snapshot,'Cijene ili pogodnosti promijenjene su tijekom AI pripreme; tekst nije spremljen');
  const provenance={...current.provenance};
  if(suggestions){suggestions.sections=(suggestions.sections||[]).map(section=>({...section,sectionIconId:defaultSectionIcon(section.kind,icons)}));provenance.editorialDraft={suggestions,generatedAt:new Date().toISOString()};}
  if(input.provider==='manual')provenance.editorInput={...provenance.editorInput,...fields};
  await current.update({provenance});
  await audit(userId,'content_prepared',{offerId:id,provider:input.provider});
  const text=input.provider==='manual'?fields:{title:suggestions.titles[0],subtitle:suggestions.subtitle,description:suggestions.descriptions[0],intro:suggestions.intro,tags:suggestions.tags};
  const sections=articleSections(displayOffer,flights,hotel,s,{...text,...(input.provider==='manual'?fields:{})},suggestions||{},icons);
  const html=(text.title?`<h1>${escapeHtml(text.title)}</h1>`:'')+(text.subtitle?`<h2>${escapeHtml(text.subtitle)}</h2>`:'')+(text.description?`<p>${escapeHtml(text.description)}</p>`:'')+renderArticleSections(sections,icons);
  return {suggestions,fields,html,editorSections:sections,provider:input.provider};
}
// Populate the existing AddArticle form without writing an article or section.
export async function articleForm(id,input={}){
  const offer=await models().Offer.findByPk(id);assert(offer?.selection,'Najprije spremi odabir');
  const fields=validateManualFields(input.fields||{}),s=await settings(),icons=await editorialIcons();
  const saved=offer.provenance?.editorialDraft?.suggestions||{},editor={...offer.provenance?.editorInput,...fields};
  const displayOffer={...offer.toJSON(),data:{...offer.data,hotels:(await recoverStoredHotelFeatures(offer.data.hotels||[])).map(storedHotelForDisplay)}};
  const flights=await selectedFlights(offer),hotel=offer.selection.flightsOnly||offer.selection.template==='monthly'?null:displayOffer.data.hotels[offer.selection.hotelIndex];
  const sections=articleSections(displayOffer,flights,hotel,s,editor,saved,icons);
  const airportId=offer.airportCityId||(await origins()).find(origin=>origin.code===offer.origin)?.id||null;
  const automated=await articleAutomation(displayOffer,s,db.models);
  const flightNotesSection=offer.selection.template==='roundup'?sections.filter(section=>section.kind.startsWith('destination_')).at(-1)?.kind:'flights';
  return {version:1,offerId:offer.id,...automated,outsideEurope:offerAirportNames(offer).outsideEurope===true,values:{
    article_title:editor.title??saved.titles?.[0]??'',article_subtitle:editor.subtitle??saved.subtitle??'',article_description:editor.description??saved.descriptions?.[0]??'',
    article_video:automated.automation.video?.url||'',article_type:2,article_country:null,article_place:null,article_airport_city_id:airportId,
    metatags:(editor.tags??saved.tags??'').split(',').map(tag=>({metatag_text:tag.trim()})).filter(tag=>tag.metatag_text),
    sections:sections.map(section=>({kind:section.kind,section_subtitle:section.subtitle,section_text:section.text,section_icon:section.sectionIconId,section_url_title:section.link_title||'',section_url_link:section.link_url||'',section_images:section.images||[],...(section.kind===flightNotesSection?{required_notes:renderFlightNotes(flights),notes_marker:fareChangeNotice}:{}),show_visa_info:false,show_best_time_to_visit:false,show_country_language:false})),
  }};
}
export async function select(id,selection,userId) {
  const o=await models().Offer.findByPk(id);assert(o,'Ponuda ne postoji');
  assert(!selection.template || ['route','monthly','roundup'].includes(selection.template),'Nepoznat predložak');
  if(isRoundupOffer(o))assert(selection.template==='roundup','Za objedinjenu ponudu koristi pregled više odredišta');
  if(selection.template==='roundup'){
    assert(isRoundupOffer(o),'Pregled više odredišta zahtijeva objedinjenu ponudu');
    selection.flightsOnly=true;selection.hotelIndex=null;selection.extraHotelIndices=[];selection.hostel=null;
  }
  assert(Array.isArray(selection.flightIndices) && selection.flightIndices.every(Number.isInteger),'Neispravni indeksi letova');
  const fs=selection.flightIndices?.map(i=>o.data.flights[i]);
  assert(fs?.length && fs.length<=90 && fs.every(f=>f && f.origin===o.origin),'Neispravan izbor letova');
  assert(new Set(selection.flightIndices).size===selection.flightIndices.length,'Duplicirani termini');
  if(selection.template==='monthly') {
    selection.hostel=null;selection.extraHotelIndices=[];
    assert(/^\d{4}-\d{2}$/.test(selection.month),'Odaberite mjesec pregleda');
    const flights=await selectedFlights(o,selection);
    assert(flights.every(f=>f.departureDate.startsWith(selection.month)),'Svi termini moraju pripadati odabranom mjesecu');
    await o.update({selection,status:'ready_for_selection'});await audit(userId,'selection',{offerId:id,selection});return o;
  }
  if(selection.flightsOnly===true){
    selection.hotelIndex=null;selection.extraHotelIndices=[];selection.hostel=null;
    await selectedFlights(o,selection);
    await o.update({selection,status:'ready_for_selection'});await audit(userId,'selection',{offerId:id,selection});return o;
  }
  const hotel=o.data.hotels[selection.hotelIndex];assert(hotel,'Odaberite glavni smještaj');
  assert(hotel.adults===2,'Smještaj se odabire za dvije osobe');
  const stayFlight=flightForStay({...o.toJSON(),selection},hotel);
  if(stayFlight){
    if(!selection.flightIndices.includes(stayFlight.index)){selection.flightIndices.push(stayFlight.index);fs.push(stayFlight.flight);}
    selection.exampleIndex=selection.flightIndices.indexOf(stayFlight.index);
  }
  const example=fs[selection.exampleIndex||0]; assert(example,'Odaberite glavni termin');
  // Explicit local stay dates are required; flight departure is never assumed to be arrival.
  assert(selection.checkin===hotel.checkin && selection.checkout===hotel.checkout,'Datumi smještaja ne odgovaraju izboru');
  nights(selection.checkin,selection.checkout);
  assert(selection.checkin>=example.departureDate && selection.checkout<=example.returnDate,'Smještaj nije unutar putovanja');
  assert(hotel.available!==false,'Smještaj je nedostupan');
  assert(Array.isArray(selection.extraHotelIndices||[])&&(selection.extraHotelIndices||[]).every(Number.isInteger)&&new Set(selection.extraHotelIndices||[]).size===(selection.extraHotelIndices||[]).length&&!(selection.extraHotelIndices||[]).includes(selection.hotelIndex),'Neispravan odabir alternativnih smještaja');
  for(const i of selection.extraHotelIndices||[]) {
    const h=o.data.hotels[i];assert(h && h.available!==false && h.checkin===hotel.checkin && h.checkout===hotel.checkout && h.adults===hotel.adults,'Dodatni hotel mora imati iste datume i goste');
  }
  if(selection.hostel) {
    if(selection.hostel.adults===2){
      const h=selection.hostel;
      selection.hostel={url:h.url,totalEur:h.totalEur,adults:2,checkin:hotel.checkin,checkout:hotel.checkout,roomType:h.roomType,bathroom:h.bathroom,freeCancellation:h.freeCancellation,breakfast:h.breakfast,kitchen:h.kitchen,lockers:h.lockers};
    }
    renderHostel(selection.hostel,await settings());
    if(typeof selection.hostel.description==='string') selection.hostel={url:selection.hostel.url,description:selection.hostel.description.trim()};
    else if(selection.hostel.adults!==2) {
      assert(selection.hostel.checkin===hotel.checkin && selection.hostel.checkout===hotel.checkout,'Hostel mora imati iste datume');
      selection.hostel.verifiedAt=selection.hostel.evidence && selection.hostel.allFeesConfirmed===true && selection.hostel.available===true?new Date().toISOString():null;
    }
  }
  await o.update({selection,status:'ready_for_selection'});await audit(userId,'selection',{offerId:id,selection});return o;
}
export async function selectedFlights(o,selection=o.selection,transaction) {
  const flights=selection.flightIndices.map(i=>o.data.flights[i]);
  if(selection.template!=='monthly'&&!selection.flightsOnly){
    const stayFlight=flightForStay({...o.toJSON(),selection},o.data.hotels?.[selection.hotelIndex]);
    if(stayFlight&&!selection.flightIndices.includes(stayFlight.index))flights.push(stayFlight.flight);
  }
  for(const extra of selection.additionalSelections||[]) {
    const other=await models().Offer.findByPk(extra.offerId,{transaction});
    assert(other && other.origin===o.origin,'Mjesečni članak mora imati jedno polazište i isti tip izvora');
    assert(Array.isArray(extra.flightIndices) && extra.flightIndices.length,'Odaberite termine dodatne rute');
    flights.push(...extra.flightIndices.map(i=>other.data.flights[i]));
  }
  assert(flights.length<=90 && flights.every(f=>f && f.origin===o.origin && f.available!==false),'Neispravan izbor ili nedostupan let');
  return flights;
}
export async function verify(id,input,userId) {
  let recoveredHotel=null;
  if(input.kind==='hotel'&&input.quickPrice===true&&Number.isInteger(input.index)&&input.index>=0){
    const snapshot=await models().Offer.findByPk(id),hotel=snapshot?.data.hotels?.[input.index];
    if(hotel)recoveredHotel=storedHotelForDisplay((await recoverStoredHotelFeatures([hotel]))[0]);
  }
  return db.sequelize.transaction(async transaction=>{
  const o=await models().Offer.findByPk(id,{transaction,lock:transaction.LOCK.UPDATE});assert(o,'Ponuda ne postoji');
  assert(['flight','hotel'].includes(input.kind) && Number.isInteger(input.index) && input.index>=0,'Neispravna vrsta ili indeks opcije');

  if(input.kind==='flight'&&input.quickPrice===true){
    const data=structuredClone(o.data),item=data.flights[input.index];assert(item,'Opcija ne postoji');
    const checked=confirmedPairFlight(item,{priceEur:input.priceEur,airlineCode:input.airlineCode});
    Object.assign(item,{priceCents:checked.priceCents,available:true,verifiedAt:checked.verifiedAt,evidence:checked.evidence,sellers:[],priceHistory:[...(item.priceHistory||[]),{priceCents:checked.priceCents,at:checked.verifiedAt}].slice(-20)});
    if(Object.hasOwn(input,'airlineCode'))Object.assign(item,{airline:checked.airline,airlineCode:checked.airlineCode,airlineCodes:checked.airlineCodes});
    await o.update({data},{transaction});await audit(userId,'verify_flight_price',{offerId:id,index:input.index,priceCents:item.priceCents,airlineCode:item.airlineCode},transaction);return o;
  }
  if(input.kind==='hotel'&&input.quickPrice===true){
    const data=structuredClone(o.data),item=data.hotels[input.index];assert(item,'Opcija ne postoji');
    if(recoveredHotel&&item.propertyId===recoveredHotel.propertyId&&item.searchId===recoveredHotel.searchId&&item.checkin===recoveredHotel.checkin&&item.checkout===recoveredHotel.checkout){
      for(const key of ['freeCancellation','cancellationDeadline','breakfast','parking','freeParking'])if(item[key]==null&&recoveredHotel[key]!=null)item[key]=recoveredHotel[key];
      if(recoveredHotel.rawRateMetadata?.featuresVersion===1)item.rawRateMetadata={...item.rawRateMetadata,features:recoveredHotel.rawRateMetadata.features,featuresVersion:1};
    }
    const total=cents(input.priceEur);assert(total>0,'Unesite provjerenu ukupnu cijenu boravka');
    for(const key of ['parking','freeParking','freeCancellation'])if(input[key]!==undefined){assert(typeof input[key]==='boolean','Oznaka pogodnosti mora biti da ili ne');item[key]=input[key];}
    if(input.freeCancellation===false||input.freeCancellation===true&&item.cancellationDeadline&&Date.parse(item.cancellationDeadline)<=Date.now())item.cancellationDeadline=null;
    if(item.freeParking===true)item.parking=true;
    Object.assign(item,{totalEur:total/100,totalIncludesTaxAndFees:true,additionalTaxesFeesEur:0,available:true,verifiedAt:new Date().toISOString(),editorApproved:true,ratePolicyVerified:true,evidence:'Urednički potvrđena ukupna cijena sa svim naknadama'});
    await o.update({data},{transaction});await audit(userId,'verify_hotel_price',{offerId:id,index:input.index,priceCents:total,parking:item.parking??null,freeParking:item.freeParking??null},transaction);return o;
  }
  assert(typeof input.evidence==='string' && input.evidence.length>0 && input.evidence.length<=2000 && typeof input.seller==='string' && input.seller.length>0 && input.seller.length<=200,'Unesite izvor provjere i prodavatelja');
  const data=structuredClone(o.data), list=input.kind==='hotel'?data.hotels:data.flights;
  const item=list[input.index];assert(item,'Opcija ne postoji');
  if(input.kind==='hotel') {
    for(const k of ['freeCancellation','breakfast']) if(input[k]!==undefined) assert(input[k]===null||typeof input[k]==='boolean',`Polje mora biti da, ne ili nepoznato: ${k}`);
    if(input.ratePolicyVerified!==undefined)assert(typeof input.ratePolicyVerified==='boolean','Potvrda tarife mora biti boolean');
    Object.assign(item,{totalEur:input.totalEur,totalIncludesTaxAndFees:input.totalIncludesTaxAndFees,additionalTaxesFeesEur:input.additionalTaxesFeesEur});
    assert(stayTotal(item)!==null,'Porezi i obvezne naknade moraju biti poznati');
    for(const k of ['freeCancellation','breakfast','ratePolicyVerified','cancellationDeadline','roomType','directAirlineUrl']) if(input[k]!==undefined) item[k]=input[k];
    Object.assign(item,{available:input.available===true,verifiedAt:new Date().toISOString(),seller:input.seller,evidence:input.evidence});
  } else {
    if(input.airline) item.airline=String(input.airline);if(input.fareCode) item.fareCode=String(input.fareCode);
    const sellers=(item.sellers||[]).filter(x=>x.seller!==input.seller);
    sellers.push({seller:input.seller,priceCents:cents(input.priceEur),available:input.available===true,verifiedAt:new Date().toISOString(),evidence:input.evidence,directAirlineUrl:input.directAirlineUrl||null});
    const available=sellers.filter(x=>x.available && Date.now()-Date.parse(x.verifiedAt)<180*60000).sort((a,b)=>a.priceCents-b.priceCents);
    Object.assign(item,available[0]||{available:false,verifiedAt:null});item.sellers=sellers;
  }
  await o.update({data},{transaction});await audit(userId,'verify',{offerId:id,input},transaction);return o;
  });
}
export async function generateDraft(id,input,userId) {
  assert(process.env.DEAL_FINDER_CMS_DRAFTS_ENABLED==='true',
    'Spremanje u CMS je blokirano: lokalno okruženje koristi zajedničku live bazu. Najprije potvrdite produkcijsku zaštitu nacrta. Pregled ponude i odabir ostaju dostupni.');
  return db.sequelize.transaction(async transaction=>{
    const o=await models().Offer.findByPk(id,{transaction,lock:transaction.LOCK.UPDATE});assert(o?.selection,'Najprije spremite izbor');
    if(o.articleId && !input.newDraft) return {articleId:o.articleId,existing:true};
    if(o.articleId) {
      const existing=await db.models.Article.findByPk(o.articleId,{transaction});
      assert(existing?.is_deal_draft,'Objavljeni članak ne može se regenerirati');
    }
    const s=await settings(), saved=o.provenance?.editorialDraft?.suggestions;
    const text=saved||{};
    const flights=await selectedFlights(o,o.selection,transaction), hotel=o.selection.template==='monthly'?null:o.data.hotels[o.selection.hotelIndex];
    const articleTypeId=2; // Existing CMS airplane-ticket category, same convention as the classic editor.
    assert(await db.models.ArticleType.findByPk(articleTypeId,{transaction}),'Kategorija avio karata nije pronađena u CMS-u');
    const fields=validateManualFields({...o.provenance?.editorInput,...input});
    const icons=await editorialIcons();checkSectionIcons(fields.sections,icons);
    const title=fields.title??saved?.titles?.[0]??'',description=fields.description??saved?.descriptions?.[0]??'';
    assert(title.trim().length>0&&title.length<=100,'Unesite naslov do 100 znakova ili pripremite članak');
    assert(typeof description==='string' && description.trim().length>0 && description.length<=100,'Opis mora imati najviše 100 znakova');
    const subtitle=fields.subtitle??saved?.subtitle??'';
    assert(typeof subtitle==='string' && subtitle.trim().length>0 && subtitle.length<=100,'Unesite podnaslov do 100 znakova');
    const columns=await db.sequelize.getQueryInterface().describeTable('article',{transaction});
    const descriptionType=columns.description?.type||'';
    const limit=descriptionType.match(/(?:VAR)?CHAR\((\d+)\)/i);
    assert(!limit || description.length<=Number(limit[1]),'Postojeća kolumna opisa je prekratka. Odvojeno dogovorite proširenje opisa; migracija ga namjerno ne mijenja.');
    const tags=fields.tags??saved?.tags??'',intro=fields.intro??saved?.intro??'';
    const article=await db.models.Article.create({title,slug:await createUniqueArticleSlug(db.models.Article,title,{transaction}),subtitle,description,metatags:tags,date_written:new Date().toISOString().slice(0,10),userId,articleTypeId,airportCityId:o.airportCityId,is_deal_draft:true},{transaction});
    const sections=articleSections(o,flights,hotel,s,{...fields,intro},saved||{},icons);
    await db.models.Section.bulkCreate(sections.map((section,index)=>({...section,articleId:article.id,order:index+1})),{transaction});
    const extraHotels=(o.selection.extraHotelIndices||[]).map(i=>o.data.hotels[i]);
    await o.update({articleId:article.id,status:'draft',provenance:{...o.provenance,previousArticleIds:[...(o.provenance.previousArticleIds||[]),...(o.articleId?[o.articleId]:[])],text,generatedAt:new Date().toISOString(),editorInput:{...fields,title,subtitle,description,intro,tags},generatedFacts:{flights,hotel,extraHotels,hostel:o.selection.hostel||null}}},{transaction});
    await audit(userId,'draft_created',{offerId:id,articleId:article.id},transaction);
    return {articleId:article.id};
  });
}
export async function scheduledTick() {
  const s=await settings(); if(!s.scheduleEnabled||!process.env.SERPAPI_API_KEY) return;
  const latest=await models().Run.findOne({where:{source:'scheduled'},attributes:['key'],order:[['createdAt','DESC'],['id','DESC']]});
  const day=scheduleKey(new Date(),s,latest?.key?.match(/^scheduled:(\d{4}-\d{2}-\d{2})$/)?.[1]||null);if(!day) return;
  const active=(await origins(s)).filter(a=>a.code);
  const previous=await orderedRows(models().Run,{where:{source:'scheduled'},order:[['createdAt','DESC'],['id','DESC']],limit:100});
  const last=code=>previous.findIndex(r=>r.input.origins.includes(code));
  active.sort((a,b)=>(last(b.code)===-1?1000:last(b.code))-(last(a.code)===-1?1000:last(a.code)));
  if(!active.length) return;
  const start=new Date();start.setUTCDate(start.getUTCDate()+30);const end=new Date(start);end.setUTCDate(end.getUTCDate()+90);
  await startSearch({mode:'discover',discoveryStrategy:'cheap_first',origins:active.slice(0,s.originsPerRun).map(a=>a.code),start:start.toISOString().slice(0,10),end:end.toISOString().slice(0,10),minimumDays:1,adults:1},null,{key:`scheduled:${day}`,source:'scheduled'});
}
