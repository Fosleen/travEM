import test from 'node:test';
import assert from 'node:assert/strict';
import {renderHostel,defaults} from '../app/services/dealFinder/domain.js';
import {editorialFacts} from '../app/services/dealFinder/editorialFacts.js';
import {articleSections} from '../app/services/dealFinder/editorialDraft.js';
import {recoverEditorial} from '../app/services/dealFinder/editorialRecovery.js';
import {resolveEditorialText} from '../app/services/dealFinder/textGeneration.js';

const hostel={url:'https://www.hostelworld.com/example',adults:2,totalEur:120,checkin:'2026-12-01',checkout:'2026-12-04',roomType:'private_room',bathroom:'private',freeCancellation:true,breakfast:false,kitchen:true,lockers:false};
const hotel={name:'Hotel',bookingUrl:'https://www.booking.com/hotel/es/example.html',adults:2,checkin:hostel.checkin,checkout:hostel.checkout,totalEur:200,totalIncludesTaxAndFees:true,verifiedAt:'2026-11-01',available:true,freeCancellation:true};
const flight={origin:'ZAG',destination:'ACE',departureDate:hostel.checkin,returnDate:hostel.checkout,priceCents:10000,verifiedAt:'2026-11-01',available:true};
const offer={origin:'ZAG',destination:'ACE',selection:{template:'route',flightIndices:[0],hotelIndex:0,extraHotelIndices:[],hostel},data:{flights:[flight],hotels:[hotel]}};

test('Hostelworld affiliate links work with existing saved settings and preserve tracking and destination',()=>{
  const url='https://hostelworld.prf.hn/click/camref:1101l4kIqP/[p_id:1101l587027]/destination:https%3A%2F%2Fwww.hostelworld.com%2Fpwa%2Fhosteldetails.php%2FPLUS-Prague%2FPrague%2F18239%3Ffrom%3D2026-12-21%26to%3D2026-12-24%26guests%3D2';
  const settings={...defaults,hostelHosts:['www.hostelworld.com','hostelworld.com']};
  assert.ok(renderHostel({...hostel,url},settings).includes(url));
  const sections=articleSections({...offer,selection:{...offer.selection,hostel:{...hostel,url}}},[flight],hotel,settings);
  assert.equal(sections.find(s=>s.kind==='hostel').link_url,url);
  for(const invalid of ['https://other.prf.hn/click/test','https://hostelworld.prf.hn.evil.example/test','http://hostelworld.prf.hn/test'])assert.throws(()=>renderHostel({...hostel,url:invalid},settings),/nije odobren/);
});

test('hostel facts use two guests, distinguish room from bathroom, and do not change headline price',()=>{
  const facts=editorialFacts(offer);
  assert.equal(facts.context.hostel.cheaperThanHotels,true);
  assert.match(facts.tokens.hostel_price_person,/60/);
  assert.match(facts.tokens.hostel_features,/privatna soba, privatna kupaonica, besplatno otkazivanje, zajednička kuhinja/);
  assert.equal(facts.tokens.package_price_short,'200€');
  assert.match(facts.tokens.hotel_features,/besplatno otkazivanje/);
  assert.match(renderHostel(hostel,defaults),/dvije osobe/);
  assert.throws(()=>renderHostel({...hostel,totalEur:0},defaults));
  assert.throws(()=>renderHostel({...hostel,bathroom:'ensuite-ish'},defaults));
  assert.equal(editorialFacts({...offer,selection:{...offer.selection,hostel:{...hostel,totalEur:300}}}).context.hostel.cheaperThanHotels,false);
});

test('AI hostel copy is editable and appears after hotels with a CMS section link and known features',()=>{
  const facts=editorialFacts(offer);
  const recovered=recoverEditorial({intro:'Ideja za putovanje.',sections:[{kind:'hostel',subtitle:'Hostelska alternativa',text:'Za drugačiji odmor odaberi hostelsku opciju uz {{hostel_features}}.'}]},facts,resolveEditorialText);
  const hostelCopy=recovered.sections.find(s=>s.kind==='hostel');
  assert.match(hostelCopy.text,/privatna kupaonica/);
  assert.match(hostelCopy.text,/60/);
  const sections=articleSections(offer,[flight],hotel,defaults,{},recovered);
  assert.deepEqual(sections.map(s=>s.kind),['intro','flights','hotel','hostel','closing']);
  const section=sections.find(s=>s.kind==='hostel');
  assert.equal(section.link_url,hostel.url);
  assert.equal(section.link_title,'Pogledaj hostel');
  assert.match(section.text,/Hostelska|hostelsku/);
  assert.ok(!sections.find(s=>s.kind==='closing').text.includes(hostel.url));
});
