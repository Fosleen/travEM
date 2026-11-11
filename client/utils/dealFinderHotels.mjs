// Display a provider's saved stay price even while all-in fees remain unconfirmed.
// Keep this separate from the final total used for article calculations.
export function hotelDisplayPrice(hotel){
  const total=hotel?.evaluation?.total;
  if(typeof total==='number'&&Number.isFinite(total)&&total>=0)return {amountCents:total,allFeesKnown:true};
  const amount=hotel?.totalEur;
  if(amount!==null&&amount!==undefined&&amount!==''&&Number.isFinite(Number(amount))&&Number(amount)>=0)return {amountCents:Math.round(Number(amount)*100),allFeesKnown:false};
  return {amountCents:null,allFeesKnown:false};
}
export function hotelFeatures(hotel){
  return {cancellation:hotel.freeCancellation===true&&(!hotel.cancellationDeadline||Date.parse(hotel.cancellationDeadline)>Date.now()),breakfast:hotel.breakfast===true,parking:hotel.parking===true||hotel.freeParking===true};
}
const score=h=>typeof h.rating==='number'&&h.rating>=0&&[5,10].includes(h.ratingScale)&&h.rating<=h.ratingScale?h.rating*10/h.ratingScale:0;
const hotelMetrics=(hotels,indices)=>indices.map(index=>({index,price:hotelDisplayPrice(hotels[index]).amountCents,score:score(hotels[index]),reviews:hotels[index].reviews||0}));
const compareHotels=(a,b)=>(a.price??Infinity)-(b.price??Infinity)||b.score-a.score||b.reviews-a.reviews||a.index-b.index;
function recommendedRow(rows){
  let best=null;
  for(const row of rows)if(row.score>7&&row.price!==null&&(!best||compareHotels(row,best)<0))best=row;
  return best?.index??null;
}
export function recommendedHotelIndex(hotels,indices){
  return recommendedRow(hotelMetrics(hotels,indices));
}
export function sortHotelOptions(hotels,indices,mode='recommended'){
  const rows=hotelMetrics(hotels,indices),recommended=recommendedRow(rows);
  const featureSort=['cancellation','breakfast','parking'].includes(mode);
  if(featureSort)for(const row of rows)row.feature=Number(hotelFeatures(hotels[row.index])[mode]);
  return rows.sort((a,b)=>{
    if(mode==='recommended'&&a.index!==b.index&&(a.index===recommended||b.index===recommended))return a.index===recommended?-1:1;
    if(mode==='rating'){const difference=b.score-a.score;if(difference)return difference;}
    if(featureSort){
      const difference=b.feature-a.feature;if(difference)return difference;
    }
    return compareHotels(a,b);
  }).map(row=>row.index);
}
export function toggleHotelSelection(indices,index){return indices.includes(index)?indices.filter(i=>i!==index):[...indices,index];}

const hotelTypeLabels={hotel:'Hotel',hotels:'Hotel',apartment:'Apartman',apartments:'Apartmani',hostel:'Hostel',resort:'Resort',villa:'Vila',villas:'Vile','guest house':'Pansion','guesthouse':'Pansion','bed and breakfast':'Noćenje s doručkom','holiday home':'Kuća za odmor','vacation home':'Kuća za odmor','homestay':'Smještaj u domaćinstvu',motel:'Motel',campsite:'Kamp',campground:'Kamp',aparthotel:'Aparthotel',unknown:'Tip nije naveden'};
export function hotelType(hotel){
  const raw=typeof hotel?.propertyType==='string'?hotel.propertyType.trim():'';
  const key=raw.toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ')||'unknown';
  return {key,label:hotelTypeLabels[key]||raw};
}
export function hotelTypeOptions(hotels,indices){
  const types=new Map();
  for(const i of indices){const type=hotelType(hotels[i]),existing=types.get(type.key);types.set(type.key,{...type,count:(existing?.count||0)+1});}
  return [...types.values()].sort((a,b)=>a.label.localeCompare(b.label,'hr'));
}
export function filterHotelTypes(hotels,indices,excluded){return indices.filter(i=>!excluded.includes(hotelType(hotels[i]).key));}
