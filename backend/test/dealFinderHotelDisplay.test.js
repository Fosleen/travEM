import test from 'node:test';
import assert from 'node:assert/strict';
import {hotelDisplayPrice,hotelFeatures,sortHotelOptions,recommendedHotelIndex,toggleHotelSelection} from '../../client/utils/dealFinderHotels.mjs';
import {bookingHotelFeatures,storedHotelForDisplay,createHotelFeatureArchiveReader,recoverStoredHotelFeatures} from '../app/services/dealFinder/hotels.js';
import {SerpApiProvider} from '../app/services/dealFinder/providers.js';
import {evaluateStay,stayTotal} from '../app/services/dealFinder/domain.js';

test('explicit excluded API fees are added once to the stay price',async()=>{
  let calls=0;
  const provider=new SerpApiProvider(async()=>{calls++;return {properties:[{name:'Lanzarote example',currency:'EUR',extracted_price:245.67,extracted_price_per_night:81.89,extracted_taxes_and_fees:15}]};});
  const {hotels}=await provider.search({mode:'hotels',place:'Lanzarote',checkin:'2026-12-01',checkout:'2026-12-04',rooms:1,minRating:7});
  const hotel={...hotels[0],evaluation:evaluateStay(hotels[0])};
  assert.deepEqual(hotelDisplayPrice(hotel),{amountCents:26067,allFeesKnown:true});
  assert.equal(stayTotal(hotel),26067);assert.equal(calls,1);assert.equal(hotel.adults,2);
  const verified={...hotel,totalIncludesTaxAndFees:false,additionalTaxesFeesEur:15};verified.evaluation=evaluateStay(verified);
  assert.deepEqual(hotelDisplayPrice(verified),{amountCents:26067,allFeesKnown:true});
});
test('old saved excluded fees work without a new request; manual totals are not charged twice',()=>{
  const old={source:'serpapi_booking',totalEur:200,totalIncludesTaxAndFees:null,additionalTaxesFeesEur:30};
  assert.equal(stayTotal(storedHotelForDisplay(old)),23000);assert.equal(old.totalIncludesTaxAndFees,null);
  assert.equal(stayTotal(storedHotelForDisplay({...old,totalIncludesTaxAndFees:true,verifiedAt:new Date().toISOString()})),20000);
});
test('amenity badges require explicit positive facts and expired cancellation is omitted',()=>{
  const features=bookingHotelFeatures({free_cancellation:true,meal_plan:'Breakfast included',amenities:['Parking']});
  assert.deepEqual(hotelFeatures(features),{cancellation:true,breakfast:true,parking:true});
  assert.deepEqual(hotelFeatures(bookingHotelFeatures({meal_plan:'Breakfast available at an extra charge',amenities:['No parking available']})),{cancellation:false,breakfast:false,parking:false});
  assert.equal(hotelFeatures({...features,cancellationDeadline:'2020-01-01T00:00:00Z'}).cancellation,false);
});
test('legacy saved hotels recover actual archive feature fields once per search without changing prices or manual facts',async()=>{
  let reads=0;
  const id='6aef6a328bed6d5febdcb93e';
  const reader=createHotelFeatureArchiveReader(async searchId=>{reads++;assert.equal(searchId,id);return {properties:[{property_id:97530,name:'Hotel Lancelot',meal_plan:'Breakfast included',free_cancellation:true,free_cancellation_until:'2099-12-09T00:00:00Z'},{property_id:91828,meal_plan:'Breakfast included'}]};});
  const hotel={source:'serpapi_booking',propertyId:97530,searchId:id,totalEur:230,verifiedAt:'2026-11-01T00:00:00Z',freeCancellation:null,breakfast:null,rawRateMetadata:{currency:'EUR'}};
  const result=(await recoverStoredHotelFeatures([hotel,{...hotel,propertyId:91828},{...hotel,propertyId:999}],reader)).map(storedHotelForDisplay);
  assert.equal(reads,1);assert.deepEqual(hotelFeatures(result[0]),{cancellation:true,breakfast:true,parking:false});assert.equal(hotelFeatures(result[1]).breakfast,true);assert.equal(hotelFeatures(result[1]).cancellation,false);assert.equal(hotelFeatures(result[2]).breakfast,false);
  assert.equal(result[0].totalEur,230);assert.equal(result[0].verifiedAt,hotel.verifiedAt);assert.equal(hotel.freeCancellation,null);
  const [again]=await recoverStoredHotelFeatures([{...hotel,freeCancellation:false}],reader);assert.equal(reads,1);assert.equal(storedHotelForDisplay(again).freeCancellation,false);
  await recoverStoredHotelFeatures([result[0]],async()=>{throw new Error('Already saved metadata must not read archive');});
});
test('unavailable archives are cached without starting replacement searches',async()=>{
  let reads=0;const reader=createHotelFeatureArchiveReader(async()=>{reads++;throw new Error('Archive expired');});
  const id='6aef6a328bed6d5febdcb93e';
  assert.equal((await reader(id)).size,0);assert.equal((await reader(id)).size,0);assert.equal(reads,1);
  assert.equal((await reader('invalid')).size,0);assert.equal(reads,1);
});
test('recommendation is the cheapest stay above 7, sorting preserves click order and promotes the next primary',()=>{
  const hotels=[{rating:7,ratingScale:10,totalEur:50},{rating:8,ratingScale:10,totalEur:100,reviews:100},{rating:9,ratingScale:10,totalEur:200,freeCancellation:true,breakfast:true},{rating:8.5,ratingScale:10,totalEur:100,reviews:200,parking:true},{rating:9,ratingScale:10,totalEur:null}];
  const indices=[0,1,2,3,4];assert.equal(recommendedHotelIndex(hotels,indices),3);
  assert.equal(sortHotelOptions(hotels,indices,'recommended')[0],3);assert.equal(sortHotelOptions(hotels,indices,'price')[0],0);assert.equal(sortHotelOptions(hotels,indices,'rating')[0],2);
  assert.equal(sortHotelOptions(hotels,indices,'cancellation')[0],2);assert.equal(sortHotelOptions(hotels,indices,'breakfast')[0],2);assert.equal(sortHotelOptions(hotels,indices,'parking')[0],3);
  let selected=toggleHotelSelection([],2);selected=toggleHotelSelection(selected,0);assert.deepEqual(selected,[2,0]);sortHotelOptions(hotels,indices,'price');assert.deepEqual(selected,[2,0]);assert.deepEqual(toggleHotelSelection(selected,2),[0]);
  assert.equal(recommendedHotelIndex(hotels,[0,4]),null);
});
test('missing or invalid prices remain unknown rather than becoming zero',()=>{
  for(const value of [null,undefined,'',-1,NaN,Infinity])assert.equal(hotelDisplayPrice({totalEur:value,evaluation:{total:null}}).amountCents,null);
  assert.deepEqual(hotelDisplayPrice({totalEur:200,evaluation:{total:21000}}),{amountCents:21000,allFeesKnown:true});
});
