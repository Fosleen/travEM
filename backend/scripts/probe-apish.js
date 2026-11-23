// Local provider probe only. No application models, database, scheduler or CMS.
import dotenv from 'dotenv';
import {fileURLToPath} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
dotenv.config({path:fileURLToPath(new URL('../.env',import.meta.url))});
const key=process.env.APISH_API_KEY;
const args=process.argv.slice(2);
if(args.includes('--check')){
 console.log(key?'APISH_API_KEY je konfiguriran. Nije poslan API upit.':'APISH_API_KEY nije konfiguriran. Nije poslan API upit.');
 process.exit(0);
}
const mode=['calendar','flights','google-calendar'].includes(args[0])?args.shift():'everywhere';
const [origin,value,departure,returnDate]=args;
const month=mode==='everywhere'?value:departure;
const validOrigin=/^[A-Z]{3}$/.test(origin||''),validDestination=/^[A-Z]{3}$/.test(value||'');
const tripLength=mode==='google-calendar'?Number(returnDate):null;
if(!validOrigin||(mode==='google-calendar'? !/^[A-Z]{3}(,[A-Z]{3}){0,6}$/.test(value||'')||!/^\d{4}-(0[1-9]|1[0-2])$/.test(month||'')||!Number.isInteger(tripLength)||tripLength<1||tripLength>60 : mode==='flights'? !validDestination||!/^\d{4}-\d{2}-\d{2}$/.test(departure||'')||!/^\d{4}-\d{2}-\d{2}$/.test(returnDate||'') : !/^\d{4}-(0[1-9]|1[0-2])$/.test(month||'')||mode==='calendar'&&!validDestination)){
 console.error('Upotreba: node scripts/probe-apish.js BUD 2027-02 | calendar BUD BKK 2027-02 | flights BUD BKK YYYY-MM-DD YYYY-MM-DD | google-calendar BUD BKK,HKT 2027-02 10');process.exit(1);
}
if(!key){console.error('Spremi APISH_API_KEY u backend/.env. Ključ nemoj slati u chat.');process.exit(1);}
const southeastAsia=new Set(['BN','KH','ID','LA','MY','MM','PH','SG','TH','TL','VN']);
const endpoint=mode==='calendar'?'flight-calendar':mode;
const url=new URL(mode==='google-calendar'?'https://api.api.sh/google-flights/v1/calendar':`https://api.api.sh/skyscanner/v1/${endpoint}`);
const query=mode==='everywhere'?{origin,month,return_month:month,adults:'1',cabin:'economy'}:mode==='calendar'?{origin,destination:value,month}:{origin,destination:value,date:departure,return_date:returnDate,adults:'1',cabin:'economy',sort:'cheapest'};
if(mode==='google-calendar'){
 const end=new Date(`${month}-01T12:00:00Z`);end.setUTCMonth(end.getUTCMonth()+1);end.setUTCDate(0);
 end.setUTCDate(end.getUTCDate()-tripLength);
 if(end.toISOString().slice(0,7)!==month){console.error('Trajanje ne stane u mjesec. Nije poslan upit.');process.exit(1);}
 url.search=new URLSearchParams({origin,destination:value,start_date:`${month}-01`,end_date:end.toISOString().slice(0,10),trip_length:String(tripLength),adults:'1',cabin:'economy',currency:'EUR',country:'HU',raw:'true'}).toString();
}else url.search=new URLSearchParams({...query,market:'HU',currency:'EUR'}).toString();
const redact=text=>String(text).split(key).join('[skriveno]');
try{
 // Exactly one request. No automatic retries or follow-up searches.
 const response=await fetch(url,{headers:{'x-api-key':key},signal:AbortSignal.timeout(120000),redirect:'error'});
 const text=await response.text();
 let data;try{data=JSON.parse(text);}catch{throw new Error(`HTTP ${response.status}: odgovor nije JSON.`);}
 if(!response.ok||data.success===false)throw new Error(`HTTP ${response.status}: ${redact(data.error||'API nije prihvatio upit.').slice(0,300)}`);
 const clean=value=>Array.isArray(value)?value.map(clean):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([k])=>!['api_key','token','authorization','x-api-key',...(mode==='google-calendar'?[]:['raw'])].includes(k.toLowerCase())).map(([k,v])=>[k,clean(v)])):typeof value==='string'?redact(value):value;
 if(mode!=='everywhere'){
  const filename=mode==='google-calendar'?`apish-${mode}-${origin}-${value.replaceAll(',','_')}-${month}-${tripLength}`:`apish-${mode}`;
  const output=new URL(`../.runtime/${filename}.json`,import.meta.url);
  await mkdir(new URL('../.runtime/',import.meta.url),{recursive:true});
  await writeFile(output,JSON.stringify(clean({testedAt:new Date().toISOString(),query:Object.fromEntries(url.searchParams),response:data}),null,2),'utf8');
  const summary={query:Object.fromEntries(url.searchParams),responseFields:Object.keys(data),trip:data.trip,tripLength:data.trip_length,complete:data.complete,total:data.total,count:data.count,pricedDays:data.priced_days,cheapest:data.cheapest,note:data.note,creditsUsed:data.credits_used,cached:data.cached,
   ...(['calendar','google-calendar'].includes(mode)?{days:data.days?.slice(0,5)}:{itineraries:data.itineraries?.slice(0,3).map(i=>({price:i.price,selfTransfer:i.self_transfer,legs:i.legs?.map(l=>({from:l.origin?.code,to:l.destination?.code,departure:l.departure,arrival:l.arrival,stops:l.stops,minutes:l.duration_minutes,airlines:l.airlines?.map(a=>a.name)}))}))})};
  console.log(JSON.stringify(clean(summary),null,2));
  console.log(`Odgovor je spremljen u backend/.runtime/${filename}.json. Poslan je jedan zahtjev; dodatnih poziva nema.`);
 } else {
 const destinations=Array.isArray(data.destinations)?data.destinations:[];
 const items=destinations.map(d=>({id:d.id,name:d.name,code:d.code,type:d.type,continent:d.continent,price:d.price,priceFormatted:d.price_formatted,direct:d.cheapest_is_direct,directPrice:d.direct_price}));
 const report={testedAt:new Date().toISOString(),query:Object.fromEntries(url.searchParams),httpStatus:response.status,creditsUsed:data.credits_used??null,cached:data.cached??null,when:data.when??null,return:data.return??null,responseFields:Object.keys(data),destinationFields:destinations[0]?Object.keys(destinations[0]):[],count:destinations.length,southeastAsia:items.filter(d=>southeastAsia.has(d.code)),destinations:items};
 const output=new URL('../.runtime/apish-probe.json',import.meta.url);
 await mkdir(new URL('../.runtime/',import.meta.url),{recursive:true});
 await writeFile(output,redact(JSON.stringify(report,null,2)),'utf8');
 console.log(redact(JSON.stringify({...report,destinations:undefined},null,2)));
 console.log('Sažetak je spremljen u backend/.runtime/apish-probe.json. Poslan je jedan zahtjev; dodatnih poziva nema.');
 }
}catch(error){console.error(redact(error.message));process.exitCode=1;}
