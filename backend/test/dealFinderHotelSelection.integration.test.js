import test from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV='test';process.env.DEAL_FINDER_TEST_DB='memory';
const {default:db}=await import('../app/models/index.js');
const {createAssociations}=await import('../database_management.js');
const service=await import('../app/services/dealFinder/service.js');
const {stayTotal,evaluateStay,renderSelection,renderAlternativeHotels}=await import('../app/services/dealFinder/domain.js');

test('manual all-in hotel price approves the stay, alternatives render separately and dates remain validated without a checkbox',async()=>{
  createAssociations();await db.sequelize.sync({force:true});
  const original=globalThis.fetch;globalThis.fetch=async()=>{throw new Error('External calls forbidden');};
  try{
    const flight={origin:'ZAG',destination:'ACE',departureDate:'2026-12-01',returnDate:'2026-12-04',priceCents:10000,available:true,verifiedAt:new Date().toISOString()};
    const hotel={name:'Primary',bookingUrl:'https://www.booking.com/hotel/es/primary.html',checkin:flight.departureDate,checkout:flight.returnDate,adults:2,rooms:1,totalEur:200,totalIncludesTaxAndFees:null,additionalTaxesFeesEur:30,source:'serpapi_booking',rating:6,ratingScale:10,reviews:2};
    const offer=await db.dealFinder.Offer.create({key:'hotel-test',origin:'ZAG',destination:'ACE',data:{flights:[flight],hotels:[hotel,{...hotel,name:'Alternative',bookingUrl:'https://www.booking.com/hotel/es/alternative.html'}]},provenance:{}});
    await service.verify(offer.id,{kind:'hotel',index:0,quickPrice:true,priceEur:230,freeParking:true},null);
    await service.verify(offer.id,{kind:'hotel',index:1,quickPrice:true,priceEur:300},null);
    await offer.reload();const main=offer.data.hotels[0],alt=offer.data.hotels[1];
    assert.equal(stayTotal(main),23000);assert.equal(main.additionalTaxesFeesEur,0);assert.equal(main.editorApproved,true);assert.equal(main.freeCancellation,undefined);assert.deepEqual(evaluateStay(main).reasons,[]);
    assert.equal(main.parking,true);assert.equal(main.freeParking,true);
    const selection={template:'route',flightIndices:[0],exampleIndex:0,hotelIndex:0,extraHotelIndices:[1],checkin:hotel.checkin,checkout:hotel.checkout};
    await service.select(offer.id,selection,null);await offer.reload();assert.deepEqual(offer.selection.extraHotelIndices,[1]);
    const html=renderSelection(offer,[flight],main)+renderAlternativeHotels(offer,[alt]);assert.match(html,/Alternativni smještaji/);assert.match(html,/Alternative/);assert.match(html,/215,00/);assert.doesNotMatch(html,/365,00/);assert.match(html,/besplatan parking/);
    await assert.rejects(service.verify(offer.id,{kind:'hotel',index:0,quickPrice:true,priceEur:230,parking:'yes'},null));
    await assert.rejects(service.select(offer.id,{...selection,extraHotelIndices:[0]},null));
    await assert.rejects(service.select(offer.id,{...selection,checkin:'2026-11-30'},null));
    await assert.rejects(service.verify(offer.id,{kind:'hotel',index:0,quickPrice:true,priceEur:0},null));
    assert.equal(await db.models.Article.count(),0);
  }finally{globalThis.fetch=original;await db.sequelize.close();}
});
