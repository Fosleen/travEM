const normalized=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const room=/\b(?:room|pokoj|zimmer|soba|chambre|camera|habitacion)\b/i;
const originalRoom=/\b(?:room|pok[oó]j|zimmer|soba|chambre|camera|habitaci[oó]n)\b/i;
const identity=h=>h.property_id!=null?`id:${h.property_id}`:h.link?`url:${h.link}`:`name:${normalized(h.name)}:${JSON.stringify(h.gps_coordinates||null)}`;
function unique(properties){const rows=new Map();for(const hotel of properties){const key=identity(hotel),previous=rows.get(key);if(!previous||amount(hotel)<amount(previous))rows.set(key,hotel);}return [...rows.values()];}
const amount=h=>typeof h.extracted_price==='number'&&Number.isFinite(h.extracted_price)?h.extracted_price:Infinity;
export const isHotelProperty=property=>/^hotels?$/i.test(String(property.type||'').trim());
// Group separately listed room/unit variants, not whole hotel chains or shared city names.
export function hotelVariantFamily(name){
  const text=String(name||'').trim(),parts=text.split(/\s+[-–—|]\s*/);
  let label;
  if(parts.length>1&&(room.test(normalized(parts.slice(1).join(' ')))||/^[a-z]{0,6}\d+\b/i.test(normalized(parts[1]))))label=parts[0];
  if(!label||normalized(label).length<5){const match=text.match(originalRoom);if(match?.index>0)label=text.slice(0,match.index).replace(/[\s\-–—|]+$/g,'');}
  const key=normalized(label);
  return label&&key.length>=5?{key,label}:null;
}
export function repeatedHotelFamilies(properties){
  const groups=new Map();
  for(const hotel of unique(properties)){const family=hotelVariantFamily(hotel.name);if(!family)continue;const group=groups.get(family.key)||{...family,count:0};group.count++;groups.set(family.key,group);}
  return [...groups.values()].filter(group=>group.count>3);
}
export function diverseHotelResults(sources){
  const excluded=new Map();
  for(const source of sources)for(const family of repeatedHotelFamilies(source.properties||[])){
    const previous=excluded.get(family.key);if(!previous||previous.count<family.count)excluded.set(family.key,family);
  }
  const properties=unique(sources.flatMap(source=>(source.properties||[]).map(h=>({...h,_searchId:source.search_metadata?.id||null}))))
    .filter(h=>!excluded.has(hotelVariantFamily(h.name)?.key)).sort((a,b)=>amount(a)-amount(b)).slice(0,200);
  return {properties,excludedFamilies:[...excluded.values()]};
}
