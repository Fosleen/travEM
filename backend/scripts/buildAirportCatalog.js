// Offline build only. Usage: node scripts/buildAirportCatalog.js path/to/airports.csv
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const input=process.argv[2];
if(!input)throw new Error('Navedite lokalnu OurAirports airports.csv datoteku');
const csv=await readFile(input,'utf8');
// RFC4180 fields, including quoted commas, escaped quotes and embedded newlines.
const rows=[];let row=[],field='',quoted=false;
for(let i=0;i<csv.length;i++) {
  const c=csv[i];
  if(c==='"'){if(quoted&&csv[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}
  else if(!quoted&&(c===','||c==='\n')){row.push(field.replace(/\r$/,''));field='';if(c==='\n'){rows.push(row);row=[];}}
  else field+=c;
}
if(field||row.length){row.push(field.replace(/\r$/,''));rows.push(row);}
const header=rows.shift(),items=rows.map(r=>Object.fromEntries(header.map((k,i)=>[k,r[i]||''])));
const byCode=new Map();
for(const a of items) {
  if(!/^[A-Z]{3}$/.test(a.iata_code)||!['large_airport','medium_airport','small_airport'].includes(a.type))continue;
  const airport={code:a.iata_code,city:a.municipality||a.name,name:a.name,country:a.iso_country,continent:a.continent||null,scheduled:a.scheduled_service==='yes'};
  if(!byCode.has(airport.code)||(!byCode.get(airport.code).scheduled&&airport.scheduled))byCode.set(airport.code,airport);
}
if(byCode.size<3000)throw new Error('Katalog je neočekivano malen; postojeća datoteka nije prepisana');
const directory=new URL('../app/data/',import.meta.url);await mkdir(directory,{recursive:true});
const output=new URL('airports.json',directory);
await writeFile(output,JSON.stringify({source:'https://ourairports.com/data/',license:'Public Domain',builtAt:new Date().toISOString(),sourceSha256:createHash('sha256').update(csv).digest('hex'),airports:[...byCode.values()].sort((a,b)=>a.code.localeCompare(b.code))}));
console.log(`${byCode.size} aerodroma → ${fileURLToPath(output)} (bez spajanja na bazu)`);
