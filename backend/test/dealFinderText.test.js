import test from 'node:test';
import assert from 'node:assert/strict';
import {GroqTextGenerator,resolveEditorialText,aiConfigured,groqModel} from '../app/services/dealFinder/textGeneration.js';
import {recoverEditorial} from '../app/services/dealFinder/editorialRecovery.js';
import {paragraphs} from '../app/services/dealFinder/editorialDraft.js';
import {editorialFacts,editorialSnapshot,flightForStay} from '../app/services/dealFinder/editorialFacts.js';
const text={titles:['Malta iz Zagreba za sljedeći odmor','Vrijeme je za Maltu'],subtitles:['Bijeg na Maltu','Letovi i smještaj'],descriptions:['Odabrani termini za putovanje na Maltu.','Pripremi svoj odmor na Malti.','Pogledaj ideju za sljedeće putovanje.'],intro:'Prošetaj ulicama Vallette i pronađi bazu prema mjestima koja želiš istražiti.',tags:['Malta','putovanja']};
test('AI editorial rejects invented prices, links, amenities and overlong descriptions',()=>{
 const facts={tokens:{},context:{hotels:[]}};
 assert.equal(resolveEditorialText(text.intro,facts),text.intro);
 for(const intro of ['Let je 33 EUR.','Doručak je uključen.','Besplatno otkazivanje.','Klikni https://example.com','<script>x</script>'])assert.throws(()=>resolveEditorialText(intro,facts));
 const result=recoverEditorial({...text,descriptions:['x'.repeat(101),'Drugi opis.']},facts,resolveEditorialText);
 assert.ok(result.descriptions.every(description=>description.length<=100));
});
test('Groq adapter sends selected facts only, uses house style and does not retry',async()=>{
 const oldKey=process.env.GROQ_API_KEY,oldModel=process.env.GROQ_MODEL;
 process.env.GROQ_API_KEY='offline-test-key';process.env.GROQ_MODEL='offline-model';
 try {
  let calls=0;
  const generator=new GroqTextGenerator(async(url,request)=>{
   calls++;assert.equal(url,'https://api.groq.com/openai/v1/chat/completions');
   const body=JSON.parse(request.body);assert.equal(body.store,false);assert.equal(body.response_format.type,'json_schema');
   assert.doesNotMatch(body.messages[1].content,/2027|https:|privatni|33/);
   assert.equal(body.response_format.json_schema.strict,true);assert.equal(body.max_completion_tokens,3500);
   assert.match(body.messages[0].content,/putujEM s travEM/);assert.match(body.messages[0].content,/Povoljno na Cipar/);
   return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify(text)}}]})};
  });
  const result=await generator.generate({origin:'ZAG',destination:'MLA',data:{destinationName:'Malta',price:33,date:'2027-01-30'},provenance:{editorInput:{intro:'privatni tekst'}}});
  assert.equal(result.provider,'groq');assert.equal(calls,1);
  const failure=new GroqTextGenerator(async()=>{calls++;return {ok:false,status:429};});
  await assert.rejects(()=>failure.generate({origin:'ZAG',destination:'MLA'}),/429/);assert.equal(calls,2);
 }finally{if(oldKey===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=oldKey;if(oldModel===undefined)delete process.env.GROQ_MODEL;else process.env.GROQ_MODEL=oldModel;}
});

test('Groq rate limits show the provider retry delay without retrying or exposing the response body',async()=>{
 const oldKey=process.env.GROQ_API_KEY;process.env.GROQ_API_KEY='mock';
 try{
  for(const retryAfter of ['42',null]){
   let calls=0;
   const generator=new GroqTextGenerator(async()=>{calls++;return {ok:false,status:429,headers:{get:()=>retryAfter}};});
   await assert.rejects(()=>generator.generate({origin:'ZAG',destination:'MLA'}),retryAfter?/Groqov limit.*429.*42 sekundi/:/Groqov limit.*429.*obnovu kvote/);
   assert.equal(calls,1);
  }
 }finally{if(oldKey===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=oldKey;}
});

test('Groq defaults, opt-ins, malformed and incomplete replies; no retries or fallback',async()=>{
 const keys=['GROQ_API_KEY','GROQ_MODEL','DEAL_FINDER_AI_ENABLED'],old=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
 try{
  process.env.GROQ_API_KEY='offline';delete process.env.GROQ_MODEL;process.env.DEAL_FINDER_AI_ENABLED='true';
  assert.equal(groqModel(),'qwen/qwen3.8-27b');assert.equal(aiConfigured({aiEnabled:true}),true);assert.equal(aiConfigured({aiEnabled:false}),false);
  process.env.DEAL_FINDER_AI_ENABLED='false';assert.equal(aiConfigured({aiEnabled:true}),false);process.env.DEAL_FINDER_AI_ENABLED='true';
  for(const reply of [{choices:[{finish_reason:'length',message:{content:JSON.stringify(text)}}]},{choices:[{finish_reason:'stop',message:{content:'not JSON'}}]},{choices:[{finish_reason:'stop',message:{refusal:'no'}}]}]){
   let calls=0;const generator=new GroqTextGenerator(async()=>{calls++;return {ok:true,json:async()=>reply};});
   await assert.rejects(()=>generator.generate({origin:'ZAG',destination:'MLA'}));assert.equal(calls,1);
  }
  process.env.GROQ_API_KEY=' ';assert.equal(aiConfigured({aiEnabled:true}),false);
  await assert.rejects(()=>new GroqTextGenerator(()=>assert.fail('must not call')).generate({}),/GROQ_API_KEY/);
 }finally{for(const k of keys)if(old[k]===undefined)delete process.env[k];else process.env[k]=old[k];}
});
test('package price uses the matching flight; article paragraphs escape markup',()=>{
 const verifiedAt=new Date().toISOString(),hotel={name:'Hotel',adults:2,totalEur:230,totalIncludesTaxAndFees:true,available:true,verifiedAt,checkin:'2026-12-01',checkout:'2026-12-04'};
 const flight={priceCents:10000,available:true,verifiedAt,departureDate:hotel.checkin,returnDate:hotel.checkout};
 const offer={selection:{flightIndices:[0,1],hotelIndex:0},data:{flights:[flight,{...flight,priceCents:5000,departureDate:'2026-12-02'}],hotels:[hotel]}};
 const facts=editorialFacts(offer);assert.equal(facts.tokens.flight_price_short,'50€');assert.equal(facts.tokens.package_price_short,'215€');
 assert.equal(editorialFacts({...offer,selection:{...offer.selection,flightIndices:[1]}}).tokens.package_price_short,'215€');
 assert.equal(editorialFacts({...offer,data:{...offer.data,flights:[offer.data.flights[1]]},selection:{...offer.selection,flightIndices:[0]}}).tokens.package_price,undefined);
 assert.equal(paragraphs('Prvi.\n\nDrugi <tekst>.'),'<p>Prvi.</p><p>Drugi &lt;tekst&gt;.</p>');assert.equal(paragraphs(''),'');
});
test('monthly article facts count all selected routes without adding hotel/package claims',()=>{
 const verifiedAt=new Date().toISOString();
 const offer={origin:'ZAG',selection:{template:'monthly',month:'2026-12',flightIndices:[0,1,2],hotelIndex:0},data:{flights:[{destination:'MLA',priceCents:5000,available:true,verifiedAt},{destination:'ACE',priceCents:9500,available:true,verifiedAt},{destination:'MLA',priceCents:6000,available:true,verifiedAt}],hotels:[{name:'Unselected'}]}};
 const facts=editorialFacts(offer);assert.equal(facts.tokens.destination_count,'2');assert.equal(facts.tokens.flight_count,'3');assert.equal(facts.tokens.travel_month,'12. mjesec');
 assert.equal(facts.tokens.flight_price_short,'50€');assert.equal(facts.tokens.hotel_name,undefined);assert.equal(facts.tokens.package_price,undefined);assert.equal(facts.context.flights[1].destinationName,'Lanzarote');
});
test('stay dates identify the stored flight, including overnight arrivals, without a verification timer',()=>{
 const hotel={checkin:'2026-12-13',checkout:'2026-12-15'};
 const flight={origin:'ZAG',destination:'ACE',departureDate:'2026-12-12',arrivalDate:'2026-12-13',returnDate:'2026-12-15',priceCents:10000};
 const offer={origin:'ZAG',destination:'ACE',selection:{flightIndices:[0]},data:{flights:[{...flight,arrivalDate:'2026-12-01',priceCents:8500},flight]}};
 assert.equal(flightForStay(offer,hotel).index,1);
 assert.equal(flightForStay({...offer,data:{flights:[{...flight,destination:'MLA'}]}},hotel),null);
 assert.equal(flightForStay({...offer,data:{flights:[{...flight,available:false}]}},hotel),null);
});
test('selected hotel facts and alternatives reach AI; verified price and known amenities are inserted from facts',async()=>{
 const hotel={name:'Hotel Lancelot',checkin:'2026-12-01',checkout:'2026-12-04',adults:2,totalEur:230,totalIncludesTaxAndFees:true,available:true,verifiedAt:new Date().toISOString(),freeCancellation:true,breakfast:true,parking:true,freeParking:true};
 const offer={origin:'ZAG',destination:'ACE',selection:{flightIndices:[0],hotelIndex:0,extraHotelIndices:[1]},data:{destinationName:'Lanzarote',flights:[{priceCents:10000,departureDate:hotel.checkin,returnDate:hotel.checkout,available:true,verifiedAt:hotel.verifiedAt}],hotels:[hotel,{...hotel,name:'Alternative',totalEur:300},{...hotel,name:'Not selected'}]},provenance:{editorInput:{intro:'Private unpublished text'}}};
 const facts=editorialFacts(offer);assert.equal(facts.context.hotels.length,2);assert.equal(facts.context.hotels[0].totalPriceCents,23000);assert.ok(facts.tokens.hotel_features.includes('besplatan parking'));assert.match(facts.tokens.package_price,/215/);
 const answer={...text,intro:'Za boravak je odabran {{hotel_name}}: {{hotel_price}}. Pogodnosti: {{hotel_features}}.'};
 const oldKey=process.env.GROQ_API_KEY,oldModel=process.env.GROQ_MODEL;process.env.GROQ_API_KEY='mock';process.env.GROQ_MODEL='qwen/qwen3.8-27b';
 try{
  const generator=new GroqTextGenerator(async(url,request)=>{const body=JSON.parse(request.body),input=JSON.parse(body.messages[1].content);assert.equal(body.reasoning_effort,'none');assert.equal(body.store,false);assert.equal(input.hotels[0].totalPriceCents,23000);assert.doesNotMatch(body.messages[1].content,/Private unpublished|Not selected|https:/);return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify(answer)}}]})};});
  const result=await generator.generate(offer);assert.match(result.intro,/230,00/);assert.match(result.intro,/besplatno otkazivanje/);assert.match(result.intro,/uključen doručak/);assert.match(result.intro,/besplatan parking/);assert.doesNotMatch(result.intro,/\{\{/);
  assert.throws(()=>resolveEditorialText('Doručak i cijena su super.',facts));
  assert.throws(()=>resolveEditorialText(answer.intro+' {{invented_price}}',facts));
  assert.ok(recoverEditorial({...answer,descriptions:['x'.repeat(90)+' {{hotel_price}}','Drugi opis']},facts,resolveEditorialText).descriptions.every(description=>description.length<=100));
  assert.notEqual(editorialSnapshot(offer),editorialSnapshot({...offer,data:{...offer.data,hotels:[{...hotel,totalEur:240}]}}));
 }finally{if(oldKey===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=oldKey;if(oldModel===undefined)delete process.env.GROQ_MODEL;else process.env.GROQ_MODEL=oldModel;}
});

test('omitted hotel amenities are completed locally in one Groq call without accepting invented claims',async()=>{
 const oldKey=process.env.GROQ_API_KEY;process.env.GROQ_API_KEY='offline';
 try{
  const hotel={name:'Selected hotel',checkin:'2026-12-01',checkout:'2026-12-04',adults:2,totalEur:230,totalIncludesTaxAndFees:true,available:true,verifiedAt:new Date().toISOString(),breakfast:true,freeCancellation:true,freeParking:true};
  const offer={selection:{hotelIndex:0},data:{hotels:[hotel]}};
  const answer={...text,intro:'Za boravak smo odabrali {{hotel_name}} za {{hotel_price}}.'};
  let calls=0;const generator=new GroqTextGenerator(async()=>{calls++;return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify(answer)}}]})};});
  const result=await generator.generate(offer);assert.equal(calls,1);
  for(const feature of ['uključen doručak','besplatno otkazivanje','besplatan parking'])assert.ok(result.sections.find(s=>s.kind==='hotel').text.includes(feature));
  assert.doesNotMatch(result.intro,/\{\{/);assert.equal(answer.intro.includes('Pogodnosti'),false,'original response is not mutated');
  const facts=editorialFacts(offer),complete={...answer,intro:answer.intro+' Pogodnosti: {{hotel_features}}.'};
  assert.equal(resolveEditorialText(complete.intro,facts).match(/uključen doručak/g).length,1);
  assert.throws(()=>resolveEditorialText(answer.intro+' Dostupan je bazen.',facts),/nepotvrđene/);
  const noFeatures=editorialFacts({...offer,data:{hotels:[{...hotel,breakfast:false,freeCancellation:false,freeParking:false}]}});
  assert.doesNotMatch(resolveEditorialText(answer.intro,noFeatures),/Pogodnosti|doručak|parking|otkazivanje/);
 }finally{if(oldKey===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=oldKey;}
});
