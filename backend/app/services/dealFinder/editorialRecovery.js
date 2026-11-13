import {sectionKinds,sectionDefaults} from './editorialDraft.js';
import {editorialLanguage} from './editorialLanguage.js';

const escapeRegex=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
// Accept the model's literal rendering of facts we actually supplied, in addition
// to placeholders. Unknown numbers/amenities/links are still rejected per field.
function knownFactMatchers(facts){
 return Object.entries(facts.tokens).filter(([,value])=>value).sort((a,b)=>b[1].length-a[1].length).map(([key,value])=>{
  const pattern=/^\d+$/.test(value)?`(?<!\\d)${escapeRegex(value)}(?!\\d)`:escapeRegex(value);
  return {key,pattern:new RegExp(pattern,'gi')};
 });
}
function normalizeKnownFacts(text,matchers){
 if(typeof text!=='string')throw new Error('Nedostaje tekst');
 return text.split(/(\{\{[a-z0-9_]+\}\})/gi).map(part=>{
  if(part.startsWith('{{'))return part;
  for(const {key,pattern} of matchers){
   part=part.split(/(\{\{[a-z0-9_]+\}\})/gi).map(piece=>piece.startsWith('{{')?piece:piece.replace(pattern,()=>`{{${key}}}`)).join('');
  }
  return part;
 }).join('');
}
export function recoverEditorial(answer,facts,resolve){
 const tokens={...facts.tokens};
 // Currency spacing and individual positive features are common model variants.
 for(const [key,value] of Object.entries(facts.tokens)){
  if(key.endsWith('_short')&&value.endsWith('€')){
   tokens[`${key}_spaced`]=value.replace('€',' €');tokens[`${key}_eur`]=value.replace('€',' EUR');
  }
 }
 const features=[...new Set([...(facts.context.hotels||[]).flatMap(h=>h.features||[]),...(facts.context.hostel?.features||[])])];
 for(const [i,feature] of features.entries())tokens[`known_feature_${i}`]=feature;
 const aliases={'uključen doručak':['doručak je uključen','s doručkom','doručkom'],'besplatno otkazivanje':['besplatnim otkazivanjem'],'besplatan parking':['besplatni parking','besplatnim parkingom']};
 for(const feature of features)for(const alias of aliases[feature]||[])tokens[`known_alias_${Object.keys(tokens).length}`]=alias;
 const knownFacts={...facts,tokens},warnings=[],matchers=knownFactMatchers(knownFacts);
 const read=(value,max,label)=>{try{const result=editorialLanguage(resolve(normalizeKnownFacts(value,matchers),knownFacts)).trim();if(!result||result.length>max)throw Error();return result;}catch{warnings.push(label);return null;}};
 const origin=facts.context.originName||facts.context.originAirport||'',dest=facts.context.destinationName||facts.context.destinationAirport||'';
 const roundup=facts.context.template==='roundup',count=tokens.destination_count||'',angle=facts.context.seasonalAngle;
 const from={Zagreb:'Zagreba',Split:'Splita',Dubrovnik:'Dubrovnika',Zadar:'Zadra',Beograd:'Beograda',Sarajevo:'Sarajeva',Trst:'Trsta','Beč':'Beča','Budimpešta':'Budimpešte',Venecija:'Venecije',Pula:'Pule',Rijeka:'Rijeke',Osijek:'Osijeka',Tuzla:'Tuzle','Banja Luka':'Banje Luke',Ljubljana:'Ljubljane'}[origin]||origin;
 const originPattern=new RegExp(`(?<![\\p{L}])(?:${[origin,from,facts.context.originAirport].filter(Boolean).map(escapeRegex).join('|')})(?![\\p{L}])`,'iu');
 const amount=tokens.headline_price||tokens.package_price_short||tokens.flight_price_short||'',packageDeal=Boolean(tokens.package_price_short);
 const product=packageDeal?'let i smještaj':'povratni letovi',price=amount?`od ${amount}${packageDeal?' po osobi':''}`:'';
 const backups=(roundup?[
  `Jeftini povratni letovi iz ${from}${angle?' za Advent':''} ${price}`,
  `${count} odredišta${angle?' za Advent':''}: povratni letovi ${price}`,
  `${angle?'Advent':'Putovanja'} iz ${from}: povratne karte ${price}`,
  `Povratni letovi ${price}: ${count} odredišta iz ${from}`,
  `Odaberi odredište: jeftini povratni letovi ${price}`,
 ]:[`${dest}: ${product} ${price}`,`${product[0].toUpperCase()+product.slice(1)}: ${dest} ${price}`,`Vrijeme je za ${dest}: ${product} ${price}`,`${dest}: ${product} ${price} za tvoje putovanje`,`Povoljno putovanje: ${product} ${price} za ${dest}`]).map(t=>t.trim());
 const list=(values,max,label)=>[...new Set((Array.isArray(values)?values:[]).map(v=>read(v,max,label)).filter(Boolean))];
 let titles=list(answer?.titles,100,'naslov');
 if(!roundup)titles=titles.filter(t=>!originPattern.test(t));
 if(amount)titles=titles.filter(t=>{const valid=t.replace(/\s/g,'').includes(amount.replace(/\s/g,''))&&(roundup?/let|kart/i.test(t):t.toLowerCase().includes(dest.toLowerCase()))&&(!packageDeal||/let.*smještaj|smještaj.*let/i.test(t));if(!valid)warnings.push('cijena ili destinacija u naslovu');return valid;});
 for(const title of backups)if(titles.length<5&&title.length<=100&&!titles.includes(title))titles.push(title);
 const subtitles=list(answer?.subtitles,100,'podnaslov').filter(t=>!/parking|fleksibilni izbori|sunčanom svijetu|zimska raspoloženja/i.test(t));
 const warm=['ACE','FUE','TFS','LPA'].includes(facts.context.destinationAirport);
 for(const subtitle of warm?['U toplije krajeve','Povoljni bijeg u toplo','Kanari po dobroj cijeni','Vrijeme je za Lanzarote','Jedna od boljih cijena']:['Jedna od boljih cijena','Vrijeme je za putovanje','Povoljno do nove destinacije','Karte su već dostupne','Odabrani termini za odmor'])if(subtitles.length<5&&!subtitles.includes(subtitle))subtitles.push(subtitle);
 const descriptions=list(answer?.descriptions,100,'opis').filter(t=>t.length>=90&&(roundup||!originPattern.test(t)));
 const trimDescription=text=>{if(text.length<=100)return text;return text.slice(0,101).replace(/\s+\S*$/,'').replace(/[.,:;!?]$/,'')+'.';};
 for(const description of (roundup?[
  `Pronašli smo povratne letove za ${count} odredišta! Donosimo datume, cijene i poveznice za rezervaciju.`,
  `Povoljni povratni letovi iz ${from}: usporedi odredišta i termine te pronađi ideju za putovanje.`,
  `Tražiš ideju za putovanje? Donosimo izbor povratnih letova, datume i cijene za više odredišta.`,
 ]:[
  `Odlične ponude aviokarata${packageDeal?' i smještaja':''} za ${dest}! Pogledaj termine povratnih letova${packageDeal?' i primjer smještaja':' i isplaniraj svoje putovanje'}.`,
  `${dest}: pronašli smo povoljne letove. Donosimo datume, cijene${packageDeal?' i primjer smještaja za tvoj odmor':' i poveznice za planiranje putovanja'}.`,
  `Planiraš putovanje? ${dest} je nova ideja za odmor uz povoljne termine${packageDeal?' letova i smještaja':' povratnih letova'}.`
 ]).map(trimDescription))if(descriptions.length<3&&!descriptions.includes(description))descriptions.push(description);
 const intro=read(answer?.intro,5000,'uvod')||(roundup?`Tražiš ideju za putovanje${angle?' za Advent':''}? Izdvojili smo povratne letove iz ${from} za više odredišta. U nastavku usporedi destinacije, termine i cijene.`:`Razmišljaš o putovanju? ${dest} je sljedeća ideja za odmor. U nastavku su odabrani termini i cijene.`);
 const sections=[];
 for(const kind of sectionKinds){
  if(kind==='hotel'&&!tokens.hotel_price||kind==='alternatives'&&!(facts.context.hotels||[]).some(h=>h.role==='alternative'))continue;
  if(kind==='hostel'&&!facts.context.hostel)continue;
  const raw=Array.isArray(answer?.sections)?answer.sections.find(s=>s.kind===kind):null;
  let text=raw?read(raw.text,5000,`odlomak ${kind}`)||'':'';
  if(kind==='hotel'){
   for(const value of [tokens.hotel_name,tokens.hotel_price,tokens.hotel_features].filter(Boolean))if(!text.includes(value))text+=(text?'\n\n':'')+(value===tokens.hotel_features?'Poznate pogodnosti: ':'')+value+'.';
  }
  if(kind==='hostel'){
   for(const value of [tokens.hostel_price,tokens.hostel_price_person,tokens.hostel_features].filter(Boolean))if(!text.includes(value))text+=(text?'\n\n':'')+value+'.';
  }
  if(kind==='closing'&&!text)text='Cijene se mogu promijeniti. Aktualnu ponudu i uvjete provjeri na poveznicama prije rezervacije.';
  sections.push({kind,subtitle:raw?read(raw.subtitle,100,`naslov odlomka ${kind}`)||sectionDefaults[kind]:sectionDefaults[kind],text,sectionIconId:null});
 }
 let tags=list(answer?.tags,40,'SEO oznaka');
 for(const tag of (roundup?['jeftini letovi',origin,'povratne avionske karte','putovanja',angle,...(facts.context.destinations||[]).map(d=>d.name)]:[dest,origin,'jeftini letovi','povratne avionske karte','putovanja',`${dest} ${origin}`]))if(tags.length<5&&tag&&!tags.includes(tag)&&tag.length<=40)tags.push(tag);
 tags=tags.slice(0,10);while(tags.join(', ').length>255)tags.pop();
 return {titles:titles.slice(0,8),subtitles:subtitles.slice(0,5),subtitle:subtitles[0],descriptions:descriptions.slice(0,5),intro,sections,tags:tags.join(', '),warnings:[...new Set(warnings)]};
}
