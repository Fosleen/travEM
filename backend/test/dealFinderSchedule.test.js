import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,normalizeSettings,validateSettings,scheduleKey} from '../app/services/dealFinder/domain.js';
import {editorialFacts} from '../app/services/dealFinder/editorialFacts.js';

test('schedule supports odd dates, even dates and custom daily intervals in Zagreb time',()=>{
 const settings={...defaults,scheduleTime:'08:15'};
 assert.equal(scheduleKey(new Date('2027-02-02T07:15:00Z'),{...settings,scheduleFrequency:'even'}),'2027-02-02');
 assert.equal(scheduleKey(new Date('2027-02-03T07:15:00Z'),{...settings,scheduleFrequency:'even'}),null);
 assert.equal(scheduleKey(new Date('2027-02-01T07:15:00Z'),settings),'2027-02-01');
 assert.equal(scheduleKey(new Date('2027-02-01T07:14:59Z'),settings),null);
 const every3={...settings,scheduleFrequency:'interval',scheduleIntervalDays:3};
 assert.equal(scheduleKey(new Date('2027-02-02T07:15:00Z'),every3,'2027-01-30'),'2027-02-02');
 assert.equal(scheduleKey(new Date('2027-02-01T07:15:00Z'),every3,'2027-01-30'),null);
 assert.equal(scheduleKey(new Date('2027-03-29T06:15:00Z'),every3,'2027-03-26'),'2027-03-29');
 assert.equal(scheduleKey(new Date('2027-02-02T07:15:00Z'),every3,null),'2027-02-02');
 assert.equal(scheduleKey(new Date('2027-02-02T07:15:00Z'),every3,'2027-02-02'),null);
});
test('legacy settings remain readable while removed controls cannot disable live searches or expire checks',()=>{
 const normalized=normalizeSettings({...defaults,scheduleTime:undefined,hour:9,minute:45,enabled:false,ttlMinutes:1,adminHomeTab:'sadrzaj'});
 assert.equal(normalized.scheduleTime,'09:45');
 for(const key of ['hour','minute','enabled','ttlMinutes','adminHomeTab'])assert.equal(Object.hasOwn(normalized,key),false);
 assert.deepEqual(validateSettings(normalized),normalized);
 assert.throws(()=>validateSettings({...defaults,scheduleFrequency:'weekly'}));
 assert.throws(()=>validateSettings({...defaults,scheduleTime:'25:00'}));
 assert.throws(()=>validateSettings({...defaults,scheduleIntervalDays:0}));
});
test('verified hotel and flight prices do not expire merely because time has passed',()=>{
 const verifiedAt='2020-01-01T00:00:00Z';
 const facts=editorialFacts({origin:'ZAG',destination:'ACE',selection:{flightIndices:[0],hotelIndex:0},data:{flights:[{priceCents:10000,available:true,verifiedAt,departureDate:'2027-01-01',returnDate:'2027-01-04'}],hotels:[{name:'Hotel',totalEur:150,totalIncludesTaxAndFees:true,adults:2,checkin:'2027-01-01',checkout:'2027-01-04',available:true,verifiedAt}]}});
 assert.equal(facts.tokens.package_price_short,'175€');assert.equal(facts.tokens.flight_price_short,'100€');assert.equal(facts.context.packageFlight.verified,true);
});
