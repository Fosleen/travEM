import test from 'node:test';
import assert from 'node:assert/strict';
import {renderFlightNotes,flightBaggageDetails,fareChangeNotice} from '../app/services/dealFinder/baggage.js';
import {hotelPhotos,createHotelFeatureArchiveReader,recoverStoredHotelFeatures,storedHotelForDisplay} from '../app/services/dealFinder/hotels.js';
import {SerpApiProvider} from '../app/services/dealFinder/providers.js';

test('budget baggage notes use each selected carrier, official dimensions, paid upgrades and one price notice',()=>{
 const html=renderFlightNotes([{airline:'Ryanair'},{airlineCode:'FR'},{airlineCode:'W4'}]);
 assert.equal((html.match(/Ryanair tarifu/g)||[]).length,1);assert.match(html,/40 × 30 × 20 cm/);assert.match(html,/55 × 40 × 20 cm/);assert.match(html,/55 × 40 × 23 cm/);assert.match(html,/WIZZ Priority/);assert.match(html,/nadoplatiti/);
 assert.equal(html.split(fareChangeNotice).length,2);
 assert.doesNotMatch(renderFlightNotes([{airline:null}]),/Ryanair|Wizz|23 kg|uključena je/);
});
test('legacy baggage inclusion is stated only from explicit fare metadata, with no inferred bag weight',()=>{
 const unknown=renderFlightNotes([{airline:'Lufthansa'}]);assert.match(unknown,/nema potvrđenog podatka/);assert.doesNotMatch(unknown,/23 kg|bez doplate/);
 const html=renderFlightNotes([{airline:'Lufthansa',extensions:['1 checked bag (23 kg) included','Bag and fare conditions depend on the return flight','Wi-Fi']}]);
 assert.match(html,/23 kg/);assert.match(html,/bez doplate/);assert.match(html,/povratnom letu/);assert.doesNotMatch(html,/Wi-Fi/);
 assert.deepEqual(flightBaggageDetails({extensions:['Checked baggage for a fee','Wi-Fi']}),['Checked baggage for a fee']);
});
test('hotel search retains actual image URLs, deduplicates them and ignores unsafe or unrelated URLs',async()=>{
 const photo='https://cf.bstatic.com/xdata/images/hotel/square600/123.jpg?k=abc&o=';
 assert.deepEqual(hotelPhotos({thumbnail:photo,images:[photo,{url:'https://cf.bstatic.com/xdata/images/hotel/max1024x768/456.jpg'}],photos:['javascript:alert(1)','https://example.com/tracker']}),[{url:photo},{url:'https://cf.bstatic.com/xdata/images/hotel/max1024x768/456.jpg'}]);
 let calls=0;const provider=new SerpApiProvider(async engine=>{calls++;assert.equal(engine,'booking');return {properties:[{property_id:1,name:'Hotel',link:'https://www.booking.com/hotel/test',currency:'EUR',extracted_price:150,thumbnail:photo}]};});
 const result=await provider.search({mode:'hotels',place:'Lanzarote',checkin:'2026-12-12',checkout:'2026-12-15',rooms:1,minRating:7});
 assert.equal(calls,1);assert.deepEqual(result.hotels[0].images,[{url:photo}]);assert.equal(result.hotels[0].rawRateMetadata.imagesVersion,1);
});
test('existing searches recover thumbnails from cached archives without a new search or losing manual amenities',async()=>{
 const photo='https://cf.bstatic.com/xdata/images/hotel/square600/123.jpg';let calls=0;
 const reader=createHotelFeatureArchiveReader(async()=>{calls++;return {properties:[{property_id:1,thumbnail:photo,breakfast_included:true}]};});
 const hotel={source:'serpapi_booking',propertyId:1,searchId:'6aef6a328bed6d5febdcb93e',breakfast:false,rawRateMetadata:{featuresVersion:1,features:{breakfast_included:false}}};
 const [recovered]=await recoverStoredHotelFeatures([hotel],reader),display=storedHotelForDisplay(recovered);
 assert.deepEqual(display.images,[{url:photo}]);assert.equal(display.breakfast,false);assert.equal(hotel.images,undefined);assert.equal(calls,1);
 await recoverStoredHotelFeatures([recovered],()=>assert.fail('saved images must not trigger archive retrieval'));
});
test('any explicit baggage extensions returned with a calendar fare are retained without an extra API request',async()=>{
 let calls=0;const provider=new SerpApiProvider(async()=>{calls++;return {prices:[{outbound_date:'2026-12-01',return_date:'2026-12-04',price:150,extensions:['Checked baggage for a fee','Wi-Fi']}]};});
 const result=await provider.search({mode:'calendar',origins:['ZAG'],destination:'FCO',start:'2026-12-01',end:'2026-12-10',minimumDays:1,days:3});
 assert.equal(calls,1);assert.equal(result.flights.length,1);assert.deepEqual(result.flights[0].baggageDetails,['Checked baggage for a fee']);
});
