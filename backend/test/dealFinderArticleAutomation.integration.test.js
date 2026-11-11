import test from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV='test';process.env.DEAL_FINDER_TEST_DB='memory';
const {default:db}=await import('../app/models/index.js');
const {createAssociations}=await import('../database_management.js');
const {articleForm}=await import('../app/services/dealFinder/service.js');
const {defaults}=await import('../app/services/dealFinder/domain.js');
const {youtubeEmbedUrl,articleAffiliateOverrides}=await import('../app/services/dealFinder/articleAutomation.js');
const {storeDealArticlePrefill,readDealArticlePrefill}=await import('../../client/utils/dealArticlePrefill.mjs');

test('video parsing accepts actual YouTube IDs and rejects arbitrary embeds',()=>{
 for(const url of ['https://www.youtube.com/embed/5-Vc_VlTF-A?si=abc','https://www.youtube.com/watch?v=5-Vc_VlTF-A','https://youtu.be/5-Vc_VlTF-A'])assert.equal(youtubeEmbedUrl(url),'https://www.youtube.com/embed/5-Vc_VlTF-A');
 for(const url of ['https://evil.example/embed/5-Vc_VlTF-A','javascript:alert(1)','https://www.youtube.com/embed/nope'])assert.equal(youtubeEmbedUrl(url),'');
});

test('Prague transfer fills video and article-only affiliates, preserves Bounce and makes no external calls or database writes',async()=>{
 createAssociations();await db.sequelize.sync({force:true});
 const oldFetch=globalThis.fetch;let externalCalls=0;
 globalThis.fetch=async()=>{externalCalls++;throw new Error('No external requests allowed');};
 try{
  const continent=await db.models.Continent.create({name:'Europa',latitude:50,longitude:14,zoom:4});
  const color=await db.models.Color.create({name:'Test',hex_value:'#ffffff',url:'https://example.com/color.svg'});
  const country=await db.models.Country.create({name:'Češka',description:'Test',main_image_url:'https://example.com/c.jpg',flag_image_url:'https://example.com/f.jpg',continentId:continent.id,colorId:color.id});
  const place=await db.models.Place.create({name:'Prag',description:'Test',main_image_url:'https://example.com/p.jpg',latitude:50,longitude:14,countryId:country.id,is_on_homepage_map:false,is_above_homepage_map:false});
  const category=await db.models.ArticleType.create({id:2,name:'Aviokarte'});
  const admin=await db.models.User.create({username:'editor',password:'unused',first_name:'A',last_name:'B',is_admin:1});
  const guide=await db.models.Article.create({title:'Prag vodič',slug:'prag-vodic',date_written:'2026-06-01',placeId:place.id,countryId:country.id,articleTypeId:category.id,userId:admin.id});
  await db.models.Video.create({url:'https://www.youtube.com/embed/5-Vc_VlTF-A?si=original',articleId:guide.id});
  const draft=await db.models.Article.create({title:'Neobjavljeni video',slug:'prag-draft',date_written:'2026-06-01',placeId:place.id,articleTypeId:category.id,userId:admin.id,is_deal_draft:true});
  await db.models.Video.create({url:'https://www.youtube.com/embed/abcdefghijk',articleId:draft.id,placeId:place.id});
  const future=await db.models.Article.create({title:'Budući članak',slug:'prag-future',date_written:'2026-06-01',placeId:place.id,articleTypeId:category.id,userId:admin.id});
  await db.models.ArticleSchedule.create({articleId:future.id,publish_at:new Date(Date.now()+86400000)});
  await db.models.Video.create({url:'https://www.youtube.com/embed/lmnopqrstuv',articleId:future.id,placeId:place.id});
  const partners=await db.models.AffiliatePartner.bulkCreate([
   ['Pronađi hostel','https://hostelworld.prf.hn/click/camref:123'],['Rentaj auto','https://www.discovercars.com/?a_aid=travEM'],['Nabavi interneta','https://airalo.pxf.io/PzYBez'],['Pronađi let','https://skyscanner.pxf.io/0GX5rV'],['Ostavi prtljagu','https://go.bounce.com/PUTUJEMSTRAVEM657902'],['Pronađi smještaj','https://www.anrdoezrs.net/click-101820293-11891539'],
  ].map(([name,default_url],sort_order)=>({name,label:name,default_url,icon_url:'https://example.com/icon.svg',sort_order})));
  // Existing destination-specific links are reused exactly, not reverse-engineered.
  for(const partner of [partners[2],partners[4]])await db.models.ArticleAffiliateLink.create({articleId:guide.id,affiliatePartnerId:partner.id,url:partner.default_url+'?existing=prague',is_enabled:true});
  const flight={origin:'ZAG',destination:'PRG',departureDate:'2026-12-21',returnDate:'2026-12-24',priceCents:7900,available:true,verifiedAt:new Date().toISOString()};
  const hotel={name:'Prague Hotel',bookingUrl:'https://www.booking.com/hotel/cz/example.html',checkin:flight.departureDate,checkout:flight.returnDate,adults:2,totalEur:120,totalIncludesTaxAndFees:true,available:true,verifiedAt:flight.verifiedAt};
  const offer=await db.dealFinder.Offer.create({key:'prague-automation',origin:'ZAG',destination:'PRG',data:{flights:[flight],hotels:[hotel]},selection:{template:'route',flightIndices:[0],hotelIndex:0,exampleIndex:0,extraHotelIndices:[],hostel:{url:'https://hostelworld.prf.hn/click/camref:123/destination:https%3A%2F%2Fwww.hostelworld.com%2Fprague',adults:2,totalEur:60,checkin:hotel.checkin,checkout:hotel.checkout,roomType:'private_room',bathroom:'private',freeCancellation:false,breakfast:false,kitchen:false,lockers:false}},provenance:{}});
  const before={articles:await db.models.Article.count(),sections:await db.models.Section.count(),links:await db.models.ArticleAffiliateLink.count(),partners:JSON.stringify((await db.models.AffiliatePartner.findAll({order:[['id','ASC']],raw:true})))};
  const result=await articleForm(offer.id,{fields:{title:'Advent u Pragu: let i smještaj od 139€ po osobi',subtitle:'Advent u Pragu',description:'Ponude za Prag.',tags:'Prag, Advent'}});
  assert.equal(result.values.article_video,'https://www.youtube.com/embed/5-Vc_VlTF-A');
  assert.equal(result.automation.video.sourceTitle,'Prag vodič');
  assert.deepEqual(result.automation.warnings,[]);
  assert.equal(result.affiliateLinks.length,5);
  assert.ok(!result.affiliateLinks.some(link=>link.affiliatePartnerId===partners[4].id));
  const get=id=>result.affiliateLinks.find(link=>link.affiliatePartnerId===id).url;
  assert.equal(get(partners[1].id),'https://www.discovercars.com/czech-republic/prague?a_aid=travEM');
  assert.equal(new URL(get(partners[3].id)).searchParams.get('outboundDate'),flight.departureDate);
  assert.equal(new URL(new URL(get(partners[5].id)).searchParams.get('url')).searchParams.get('group_adults'),'2');
  assert.equal(get(partners[0].id),offer.selection.hostel.url);
  assert.equal(new URL(get(partners[2].id)).searchParams.get('u'),'https://www.airalo.com/czech-republic-esim');
  assert.equal(new URL(get(partners[2].id)).searchParams.get('partnerpropertyid'),'7393873');
  const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
  storeDealArticlePrefill(storage,result,'automation-test');
  assert.deepEqual(readDealArticlePrefill(storage,'automation-test').affiliateLinks,result.affiliateLinks);
  assert.equal(await db.models.Article.count(),before.articles);assert.equal(await db.models.Section.count(),before.sections);assert.equal(await db.models.ArticleAffiliateLink.count(),before.links);
  assert.equal(JSON.stringify(await db.models.AffiliatePartner.findAll({order:[['id','ASC']],raw:true})),before.partners);
  assert.equal(externalCalls,0);
  const other={...offer.toJSON(),destination:'ACE'};
  const otherLinks=articleAffiliateOverrides(other,partners.map(p=>p.toJSON()),defaults);
  assert.ok(!otherLinks.some(link=>[partners[1].id,partners[4].id].includes(link.affiliatePartnerId)));
  assert.equal(new URL(otherLinks.find(link=>link.affiliatePartnerId===partners[2].id).url).searchParams.get('u'),'https://www.airalo.com/spain-esim');
  assert.deepEqual(articleAffiliateOverrides({...offer.toJSON(),selection:{...offer.selection,template:'monthly'}},partners,defaults),[]);
 }finally{globalThis.fetch=oldFetch;await db.sequelize.close();}
});
