import test from 'node:test';
import strict from 'node:assert/strict';
import {defaults,stayTotal,cents,rating,evaluateStay,geography,pointInPolygon,bookingLink,hotelBookingLink,skyscanner,scheduleKey,editorial,renderSelection,renderHostel,nights,validateSettings} from '../app/services/dealFinder/domain.js';
const hotel={name:'Test',totalEur:198.13,additionalTaxesFeesEur:28.87,totalIncludesTaxAndFees:false,rating:7.4,ratingScale:10,reviews:100,adults:2,checkin:'2027-01-30',checkout:'2027-02-04',bookingUrl:'https://www.booking.com/hotel/mt/test.html',gpsCoordinates:{latitude:35.913,longitude:14.501}};
test('hotel affiliate link uses stored stay dates, two guests and existing CJ tracking',()=>{
 const affiliate=new URL(hotelBookingLink({...hotel,rooms:2,bookingUrl:hotel.bookingUrl+'?checkin=2026-01-01&group_adults=1&chal_t=secret'}));
 strict.equal(affiliate.hostname,defaults.trackingHost);strict.equal(affiliate.pathname,`/click-${defaults.publisherId}-${defaults.linkId}`);
 const target=new URL(affiliate.searchParams.get('url'));strict.equal(target.searchParams.get('checkin'),hotel.checkin);strict.equal(target.searchParams.get('checkout'),hotel.checkout);strict.equal(target.searchParams.get('group_adults'),'2');strict.equal(target.searchParams.get('no_rooms'),'2');strict.equal(target.searchParams.get('selected_currency'),'EUR');strict.equal(target.searchParams.has('chal_t'),false);
 strict.throws(()=>hotelBookingLink({...hotel,bookingUrl:'https://evil.invalid/'}));strict.throws(()=>hotelBookingLink({...hotel,bookingUrl:null}));
});
test('HT-01..04 taxes, unknown totals and per-person arithmetic',()=>{
 strict.equal(stayTotal(hotel),22700);strict.equal(stayTotal({...hotel,totalIncludesTaxAndFees:true}),19813);strict.equal(stayTotal({...hotel,totalIncludesTaxAndFees:null}),null);strict.equal((cents(33)+stayTotal(hotel)/2)/100,146.5);
 strict.equal(stayTotal({...hotel,additionalTaxesFeesEur:null}),null);
});
test('HT-05..10 source scales, review counts and rate cancellation',()=>{
 strict.equal(rating({rating:4.1,ratingScale:5}),8.2);strict.equal(rating({rating:8.2,ratingScale:10}),8.2);strict.equal(rating({rating:4.1}),null);
 const s={...defaults,scope:{center:[35.913,14.501],radiusKm:10,reviewed:true}};
 strict.deepEqual(evaluateStay(hotel,s).reasons,[]);
 strict.ok(evaluateStay({...hotel,reviews:1},s).reasons.includes('too_few_reviews'));
 strict.ok(evaluateStay({...hotel,freeCancellation:true,ratePolicyVerified:true},s).rank>evaluateStay(hotel,s).rank);
 strict.equal(evaluateStay({...hotel,freeCancellation:true},s).rank,evaluateStay(hotel,s).rank);
 strict.ok(evaluateStay({...hotel,available:false},s).reasons.includes('unavailable'));
});
test('GEO GPS required, radius and polygon boundary review',()=>{
 strict.equal(geography({}), 'needs_location_review');strict.equal(geography(hotel,{center:[41.9028,12.4964],radiusKm:10}),'outside_scope');
 strict.equal(pointInPolygon(1,1,[[0,0],[2,0],[2,2],[0,2]]),true);strict.equal(pointInPolygon(0,1,[[0,0],[2,0],[2,2],[0,2]]),null);
 strict.equal(geography(hotel),'scope_review_required');
});
test('AF-01..04 CJ canonicalization, encoding and injection protection',()=>{
 const link=new URL(bookingLink('https://www.booking.com/hotel/mt/a%26b.html?checkin=2027-01-30&checkout=2027-02-04&group_adults=2&chal_t=secret&force_referer=x'));
 const target=new URL(link.searchParams.get('url'));strict.equal(target.searchParams.get('checkin'),'2027-01-30');strict.equal(target.searchParams.get('group_adults'),'2');strict.equal(target.searchParams.has('chal_t'),false);strict.equal(link.pathname,'/click-101820293-15735418');
 for(const u of ['http://booking.com','https://booking.com.evil.invalid','https://a:b@booking.com'])strict.throws(()=>bookingLink(u));strict.throws(()=>bookingLink('https://booking.com',{...defaults,trackingHost:'evil.invalid'}));
});
test('SCH-01..03 odd calendar dates across month and DST boundaries',()=>{
 for(const [time,expected] of [['2027-01-31T07:00:00Z','2027-01-31'],['2027-02-01T07:00:00Z','2027-02-01'],['2027-03-29T06:00:00Z','2027-03-29'],['2027-10-31T07:00:00Z','2027-10-31']])strict.equal(scheduleKey(new Date(time)),expected);
 strict.equal(scheduleKey(new Date('2027-03-29T05:59:00Z')),null);strict.equal(scheduleKey(new Date('2027-02-02T08:00:00Z')),null);
});
test('ART deterministic dates, safe HTML, fallback and origin isolation',()=>{
 const o={origin:'ZAG',destination:'MLA'},f={...o,departureDate:'2027-01-30',returnDate:'2027-02-04',priceCents:3300,verifiedAt:null};
 const text=editorial(o);strict.equal(text.titles.length,2);strict.ok(text.descriptions.every(d=>d.length>0&&d.length<=100));strict.ok(text.subtitle.split(' ').length<=3);
 strict.match(text.titles[0],/Malta/);strict.doesNotMatch(text.titles[0],/Zagreb/);strict.equal(text.subtitle,'Bijeg na Maltu');
 const html=renderSelection(o,[f],hotel);strict.match(html,/subota/);strict.match(html,/četvrtak/);strict.match(html,/zahtijevaju provjeru/);strict.doesNotMatch(html,/33,00/);strict.doesNotMatch(html,/prtljag|doručak/);
 strict.equal(new URL(skyscanner(f)).searchParams.get('mediaPartnerId'),'6483817');strict.throws(()=>renderSelection(o,[{...f,origin:'VIE'}],hotel));strict.equal(nights('2027-01-31','2027-02-04'),4);
});
test('settings cap and type validation',()=>{strict.throws(()=>validateSettings({...defaults,monthlyCap:250}));strict.throws(()=>validateSettings({...defaults,scheduleEnabled:'false'}));strict.deepEqual(validateSettings({...defaults}),defaults);});
test('editorial suggestions use destination names and keep verified prices without automatic expiry',()=>{
 const offer={origin:'ZAG',destination:'MLA',data:{flights:[{priceCents:3300,available:true,verifiedAt:new Date().toISOString()}]}};
 const text=editorial(offer);strict.ok(text.titles.every(title=>!title.includes('€')&&title.length<=100));
 strict.ok(text.subtitles.length>=2);strict.ok(text.descriptions.every(description=>description.length<=100));
 const hostel=renderHostel({url:'https://www.hostelworld.com/hostel/test',description:'Hostel uz obalu <script>alert(1)</script>'});
 strict.match(hostel,/&lt;script&gt;/);strict.doesNotMatch(hostel,/<script>|noći|EUR|€/);
 const verified={origin:'ZAG',destination:'MLA',selection:{flightIndices:[0],hotelIndex:0},data:{flights:[{origin:'ZAG',destination:'MLA',departureDate:'2027-01-30',returnDate:'2027-02-04',priceCents:3300,available:true,verifiedAt:new Date().toISOString()}],hotels:[{...hotel,available:true,verifiedAt:new Date().toISOString(),ratePolicyVerified:true,freeCancellation:true}]}};
 strict.match(editorial(verified).titles[0],/146,50/);
 strict.ok(editorial({...verified,selection:null}).titles.every(t=>!t.includes('€')));
 const stale=structuredClone(verified);stale.data.flights[0].verifiedAt='2020-01-01T00:00:00Z';
 strict.ok(editorial(stale).titles.some(t=>t.includes('€')));
});
