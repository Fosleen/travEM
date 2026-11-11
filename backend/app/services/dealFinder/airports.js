import {readFileSync} from 'node:fs';
const catalog=JSON.parse(readFileSync(new URL('../../data/airports.json',import.meta.url),'utf8'));
const aliases={VCE:['Venecija','Venice','Venezia'],TSF:['Venecija','Venice','Venezia','Treviso'],VIE:['Beč','Vienna','Wien'],BUD:['Budimpešta','Budapest'],BEG:['Beograd','Belgrade'],TRS:['Trst','Trieste'],FCO:['Rim','Rome','Roma'],CIA:['Rim','Rome','Roma'],CDG:['Pariz','Paris'],ORY:['Pariz','Paris'],BVA:['Pariz','Paris'],JFK:['New York'],EWR:['New York'],LGA:['New York'],MLA:['Malta'],MUC:['München','Munich'],BER:['Berlin'],ATH:['Atena','Athens'],IST:['Istanbul'],SAW:['Istanbul'],CPH:['Kopenhagen','Copenhagen'],PRG:['Prag','Prague'],WAW:['Varšava','Warsaw'],LIS:['Lisabon','Lisbon'],ZRH:['Zürich','Zurich']};
const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d');
const displayNames={ZAG:'Zagreb',BSL:'Basel',CRL:'Brussels Charleroi',BGY:'Milan Bergamo',FKB:'Karlsruhe/Baden-Baden',OTP:'Bukurešt',STN:'London Stansted',SKP:'Skoplje',ACE:'Lanzarote',WMI:'Waršava Modlin',ADB:'Izmir',MXP:'Milano Malpensa',KRK:'Krakow',NCL:'Newcastle',BHX:'Birmingham',LPA:'Gran Canaria',CXR:'Cam Ranh'};
const airports=catalog.airports.map(a=>({...a,city:displayNames[a.code]||aliases[a.code]?.[0]||a.city,aliases:[a.city,...(aliases[a.code]||[])]}));
const byCode=new Map(airports.map(a=>[a.code,a]));
const indexed=airports.map(a=>({airport:a,city:normalize(a.city),text:normalize([a.code,a.city,a.name,...a.aliases].join(' '))}));
export function airportByCode(code){return byCode.get(code)||null;}
// Land neighbours for countries represented by the CMS's active origin airports.
// Maritime neighbours are intentionally excluded: Zagreb -> Milan remains relevant.
// Editorial exception: Montenegro is useful by air from Croatia and stays eligible.
const neighbours={HR:['SI','HU','RS','BA'],SI:['IT','AT','HU','HR'],HU:['AT','SK','UA','RO','RS','HR','SI'],
  AT:['DE','CZ','SK','HU','SI','IT','CH','LI'],IT:['FR','CH','AT','SI','SM','VA'],BA:['HR','RS','ME'],
  RS:['HU','RO','BG','MK','XK','AL','ME','BA','HR']};
export function excludedDiscoveryCountries(origin){
  const country=airportByCode(origin)?.country;
  return country?[country,...(neighbours[country]||[])]:[];
}
export function discoveryDestinationAllowed(origin,destination){
  const country=airportByCode(destination)?.country;
  return !country||!excludedDiscoveryCountries(origin).includes(country);
}
export function searchAirports(query){
  const q=normalize(query).trim().slice(0,100);if(q.length<2)return [];
  const words=q.split(/\s+/);
  return indexed.filter(a=>words.every(w=>a.text.includes(w))).map(a=>({airport:a.airport,score:(a.airport.code.toLowerCase()===q?100:a.airport.code.toLowerCase().startsWith(q)?80:a.city===q?60:a.city.startsWith(q)?40:0)+(a.airport.scheduled?10:0)}))
    .sort((a,b)=>b.score-a.score||a.airport.code.localeCompare(b.airport.code)).slice(0,20).map(a=>a.airport);
}
export function offerAirportNames(offer,origins=[]){
  const o=offer.toJSON?offer.toJSON():offer,origin=airportByCode(o.origin),destination=airportByCode(o.destination);
  const continent=destination?.continent||null;
  const european=destination&&(continent==='EU'||['CY','GR','ES','PT'].includes(destination.country));
  return {...o,originName:origins.find(a=>a.code===o.origin)?.name||origin?.city||o.origin,destinationName:destination?.city||o.data?.destinationName||o.destination,originCountry:origin?.country,destinationCountry:destination?.country,originAirportName:origin?.name,destinationAirportName:destination?.name,destinationContinent:continent,outsideEurope:continent?!european:null};
}
