import test from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV='test';process.env.DEAL_FINDER_TEST_DB='memory';
const {default:db}=await import('../app/models/index.js');
const {createAssociations}=await import('../database_management.js');
const service=await import('../app/services/dealFinder/service.js');
const {defaults}=await import('../app/services/dealFinder/domain.js');

test('five price headlines use the chosen short trip; editable sections and icons reach the classic CMS',async()=>{
 createAssociations();await db.sequelize.sync({force:true});
 const envKeys=['GROQ_API_KEY','DEAL_FINDER_AI_ENABLED','DEAL_FINDER_CMS_DRAFTS_ENABLED'],oldEnv=Object.fromEntries(envKeys.map(k=>[k,process.env[k]])),oldFetch=globalThis.fetch;
 try{
  process.env.GROQ_API_KEY='offline-test';process.env.DEAL_FINDER_AI_ENABLED='true';process.env.DEAL_FINDER_CMS_DRAFTS_ENABLED='true';
  await service.saveSettings({...defaults,aiEnabled:true},null);
  await db.models.ArticleType.create({id:2,name:'aviokarte'});
  const admin=await db.models.User.create({username:'editor',password:'unused',first_name:'A',last_name:'B',is_admin:1});
  const airport=await db.models.AirportCity.create({name:'Zagreb',iata_codes:['ZAG'],is_active:true});
  const flightIcon=await db.models.SectionIcon.create({url:'https://example.com/53666460054.png'});
  const hotelIcon=await db.models.SectionIcon.create({url:'https://example.com/53629517350.png'});
  const verifiedAt=new Date().toISOString(),flight={origin:'ZAG',destination:'ACE',available:true,verifiedAt:new Date(Date.now()-4*3600000).toISOString(),priceCents:10000,departureDate:'2026-12-12',returnDate:'2026-12-15'};
  const hotel={name:'Hotel Test',checkin:flight.departureDate,checkout:flight.returnDate,adults:2,rooms:1,totalEur:150,totalIncludesTaxAndFees:true,available:true,verifiedAt,ratePolicyVerified:true,editorApproved:true,breakfast:true,freeCancellation:true,bookingUrl:'https://www.booking.com/hotel/es/test.html'};
  hotel.images=[{url:'https://cf.bstatic.com/xdata/images/hotel/square600/123.jpg'}];
  const offer=await db.dealFinder.Offer.create({key:'article-draft',origin:'ZAG',destination:'ACE',airportCityId:airport.id,data:{flights:[{...flight,verifiedAt,priceCents:8500,departureDate:'2026-12-01',returnDate:'2026-12-15'},flight],hotels:[hotel]},provenance:{}});
  // A remembered long-trip example and expired flight verification must not
  // prevent a package based on the selected stay and its actual stored fare.
  await service.select(offer.id,{template:'route',flightIndices:[0],exampleIndex:0,hotelIndex:0,checkin:hotel.checkin,checkout:hotel.checkout,extraHotelIndices:[]},null);
  await offer.reload();assert.deepEqual(offer.selection.flightIndices,[0,1]);assert.equal(offer.selection.exampleIndex,1);
  let calls=0;
  globalThis.fetch=async(url,request)=>{
   calls++;assert.match(url,/api.groq.com/);const input=JSON.parse(JSON.parse(request.body).messages[1].content);
   assert.equal(input.factsTokens.headline_price,'175€');assert.equal(input.factsTokens.flight_price_short,'85€');
   return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify({
    titles:['Lanzarote: let i smještaj od 175 € po osobi','Let i smještaj na Lanzaroteu od 175€','Lanzarote iz Zagreba: let i smještaj od 175€','Odmor na Lanzaroteu: let i smještaj od 175€','Lanzarote za 999€: let i smještaj'],
    subtitles:['Jedna od boljih cijena','Povoljno na Lanzarote'],descriptions:['Lanzarote iz Zagreba: let i smještaj od 175€ po osobi.','Odabrani let i boravak na Lanzaroteu.'],tags:['Lanzarote','Zagreb','povratni letovi','let i smještaj','jeftina putovanja'],
    intro:'Lanzarote je ideja za tvoj sljedeći odmor.',sections:[{kind:'flights',subtitle:'Povratne aviokarte',text:'Pogledaj odabrane termine iz Zagreba.'},{kind:'hotel',subtitle:'Primjer smještaja',text:'Hotel Test nudi boravak za 150 € s doručkom.'},{kind:'closing',subtitle:'Prije puta',text:'Cijene se mogu promijeniti.'}]
   })}}]})};
  };
  const prepared=await service.buildContent(offer.id,{provider:'ai',confirmedAiRequest:true},null);
  delete process.env.DEAL_FINDER_CMS_DRAFTS_ENABLED;
  const articleCount=await db.models.Article.count(),sectionCount=await db.models.Section.count();
  const form=await service.articleForm(offer.id,{fields:{title:prepared.suggestions.titles[0],subtitle:'Advent na Kanarima',description:prepared.suggestions.descriptions[0],tags:prepared.suggestions.tags}});
  assert.equal(form.values.article_type,2);assert.equal(form.values.article_airport_city_id,airport.id);
  assert.match(form.values.sections[1].section_text,/<li><a[^>]+>12\.12\. \(subota\) - 15\.12\. \(utorak\): 100 €/);
  assert.match(form.values.sections[2].section_url_link,/dpbolvw/);assert.equal(form.values.sections[2].section_url_title,'Pogledaj smještaj');assert.doesNotMatch(form.values.sections[2].section_text,/<a/);
  assert.deepEqual(form.values.sections[2].section_images,hotel.images);assert.match(form.values.sections[1].section_text,/Cijene avionskih karata brzo se mijenjaju/);
  assert.equal(await db.models.Article.count(),articleCount);assert.equal(await db.models.Section.count(),sectionCount);
  process.env.DEAL_FINDER_CMS_DRAFTS_ENABLED='true';
  assert.equal(calls,1);assert.ok(prepared.suggestions.titles.length>=5);
  for(const title of prepared.suggestions.titles){assert.match(title,/175\s?€/);assert.match(title,/let.*smještaj/i);assert.doesNotMatch(title,/85|999/);}
  assert.ok(prepared.suggestions.warnings.length);assert.match(prepared.suggestions.sections.find(s=>s.kind==='hotel').text,/doruč/);
  const sections=prepared.suggestions.sections.map(s=>s.kind==='flights'?{...s,subtitle:'Moji termini',text:'Moj uređeni odlomak.',sectionIconId:hotelIcon.id}:s);
  const fields={title:prepared.suggestions.titles[0],subtitle:'Moj podnaslov',description:prepared.suggestions.descriptions[0],intro:'Moj uvod.',tags:prepared.suggestions.tags,sections};
  const preview=await service.buildContent(offer.id,{provider:'manual',fields},null);assert.match(preview.html,/Moji termini/);assert.match(preview.html,/Moj uređeni odlomak/);assert.equal(calls,1);
  const draft=await service.generateDraft(offer.id,fields,admin.id);
  const stored=await db.models.Section.findAll({where:{articleId:draft.articleId},order:[['order','ASC']]});
  assert.equal(stored.length,4);assert.equal(stored[0].text,'<p>Moj uvod.</p>');assert.equal(stored[0].subtitle,'');assert.equal(stored[0].sectionIconId,null);
  assert.equal(stored[1].subtitle,'Moji termini');assert.equal(stored[1].sectionIconId,hotelIcon.id);assert.match(stored[1].text,/skyscanner/);
  assert.equal(stored[2].sectionIconId,hotelIcon.id);assert.match(stored[2].text,/175,00/);assert.equal((await db.models.Article.findByPk(draft.articleId)).is_deal_draft,true);
  assert.equal(prepared.suggestions.sections[0].sectionIconId,flightIcon.id);assert.equal(calls,1);
  await service.select(offer.id,{template:'route',flightsOnly:true,flightIndices:[0,1],exampleIndex:1},null);await offer.reload();assert.equal(offer.selection.hotelIndex,null);
  const flightOnly=await service.generateDraft(offer.id,{...fields,newDraft:true},admin.id);
  const flightSections=await db.models.Section.findAll({where:{articleId:flightOnly.articleId}});assert.equal(flightSections.length,3);assert.ok(flightSections.every(s=>s.subtitle!=='Primjer smještaja'));
 }finally{globalThis.fetch=oldFetch;for(const k of envKeys)if(oldEnv[k]===undefined)delete process.env[k];else process.env[k]=oldEnv[k];await db.sequelize.close();}
});
