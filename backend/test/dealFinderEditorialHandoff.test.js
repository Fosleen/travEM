import test from 'node:test';
import assert from 'node:assert/strict';
import {editorialLanguage} from '../app/services/dealFinder/editorialLanguage.js';
import {recoverEditorial} from '../app/services/dealFinder/editorialRecovery.js';
import {resolveEditorialText} from '../app/services/dealFinder/textGeneration.js';
import {editorialFacts} from '../app/services/dealFinder/editorialFacts.js';
import {storeDealArticlePrefill,readDealArticlePrefill,clearDealArticlePrefill} from '../../client/utils/dealArticlePrefill.mjs';

test('editorial language normalizes every month and Zagreb without losing diacritics',()=>{
 assert.equal(editorialLanguage('U prosincu iz Velike Gorice za Lanzarote.'),'U 12. mjesecu iz Zagreba za Lanzarote.');
 const text='siječanj veljače ožujku travnjem svibanj lipnju srpnja kolovoz rujnu listopadu studenom prosinac';
 const normalized=editorialLanguage(text);for(let month=1;month<=12;month++)assert.ok(normalized.includes(`${month}. mjesec`));
 assert.equal(editorialLanguage('Šetnje, vulkanski krajolici i obalna mjesta.'),'Šetnje, vulkanski krajolici i obalna mjesta.');
});
test('Groq receives Zagreb and seasonal context; output uses numeric months and descriptive near-limit summaries',()=>{
 const facts=editorialFacts({origin:'ZAG',destination:'ACE',selection:{flightIndices:[0]},data:{flights:[{origin:'ZAG',destination:'ACE',departureDate:'2026-12-01',returnDate:'2026-12-04',priceCents:10000,available:true,verifiedAt:new Date().toISOString()}]}});
 assert.equal(facts.context.originName,'Zagreb');assert.equal(facts.context.seasonalAngle,'Advent');assert.equal(facts.tokens.travel_month,'12. mjesec');
 const answer={titles:['Lanzarote iz Velika Gorica od 100€','Lanzarote u prosincu: povratni letovi od 100€'],subtitles:['Prosinac na Kanarima','Fleksibilni izbori','Smještaj s parkingom'],descriptions:['Kratak opis.'],intro:'Lanzarote u prosincu poziva na šetnje vulkanskim krajolicima.',tags:['Velika Gorica','Lanzarote','prosinac','jeftini letovi','putovanja'],sections:[]};
 const result=recoverEditorial(answer,facts,resolveEditorialText);
 assert.ok(result.titles.length>=5);assert.doesNotMatch(JSON.stringify(result),/Velik[a-z]* Goric[a-z]*|prosin/);
 assert.ok(result.titles.every(title=>!title.includes('Zagreb')));assert.ok(result.descriptions.every(description=>description.length<=100&&!description.includes('Zagreb')));assert.ok(result.descriptions.some(description=>description.length>=90));
 assert.ok(result.subtitles.every(subtitle=>!/fleksibilni|parking/i.test(subtitle)));assert.ok(result.intro.includes('12. mjesec'));
});
test('AddArticle prefill is tab-local, survives rerender and contains structured section links',()=>{
 const values=new Map(),storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
 const payload={version:1,offerId:42,values:{article_title:'Naslov',article_subtitle:'Podnaslov',article_description:'Opis',sections:[{section_text:'<p>Uvod</p>',section_url_link:''},{section_text:'<p>Hotel</p>',section_url_title:'Pogledaj smještaj',section_url_link:'https://example.com'}]}};
 const token=storeDealArticlePrefill(storage,payload,'test-token');assert.deepEqual(readDealArticlePrefill(storage,token).values,payload.values);assert.equal(readDealArticlePrefill(storage,token).offerId,42);
 assert.equal(readDealArticlePrefill(storage,'../other'),null);clearDealArticlePrefill(storage,token);assert.equal(readDealArticlePrefill(storage,token),null);
});
