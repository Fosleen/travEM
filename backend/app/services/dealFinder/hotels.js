export function hotelPhotos(property){
 const values=[property?.thumbnail,...(Array.isArray(property?.images)?property.images:[]),...(Array.isArray(property?.photos)?property.photos:[])];
 const urls=values.map(value=>typeof value==='string'?value:value?.original_image||value?.url||value?.thumbnail).filter(Boolean);
 const unique=[];
 for(const value of urls){try{const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password||!(url.hostname==='bstatic.com'||url.hostname.endsWith('.bstatic.com')))continue;if(!unique.includes(url.href))unique.push(url.href);}catch{/* Ignore malformed image metadata. */}}
 return unique.slice(0,8).map(url=>({url}));
}
export function bookingHotelFeatures(property){
  const amenities=Array.isArray(property.amenities)?property.amenities:[];
  const parking=property.parking===true||property.parking_available===true||property.free_parking===true||amenities.some(a=>typeof a==='string'?/^(?:free |private |public |on.site )?parking(?: available)?$/i.test(a):a?.available!==false&&/^(?:free |private |public |on.site )?parking$/i.test(a?.name||''));
  return {freeCancellation:typeof property.free_cancellation==='boolean'?property.free_cancellation:null,cancellationDeadline:property.free_cancellation_until||null,
    breakfast:property.breakfast_included===true||/^breakfast included$/i.test(property.meal_plan||'')?true:null,parking:parking?true:null,freeParking:property.free_parking===true?true:null};
}
export function storedHotelForDisplay(hotel){
  const features=bookingHotelFeatures(hotel.rawRateMetadata?.features||{});
  const photos=[...(Array.isArray(hotel.photos)?hotel.photos:[]),...(Array.isArray(hotel.rawRateMetadata?.features?.photos)?hotel.rawRateMetadata.features.photos:[])];
  hotel={...hotel,images:hotelPhotos({...hotel,photos,thumbnail:hotel.thumbnail||hotel.rawRateMetadata?.features?.thumbnail}),freeCancellation:hotel.freeCancellation??features.freeCancellation,cancellationDeadline:hotel.cancellationDeadline??features.cancellationDeadline,breakfast:hotel.breakfast??features.breakfast,parking:hotel.parking??features.parking,freeParking:hotel.freeParking??features.freeParking};
  // Older saved API results already contain the explicitly excluded fees. No new search needed.
  if(hotel.source==='serpapi_booking'&&!hotel.verifiedAt&&hotel.totalIncludesTaxAndFees==null&&typeof hotel.additionalTaxesFeesEur==='number'&&Number.isFinite(hotel.additionalTaxesFeesEur)&&hotel.additionalTaxesFeesEur>=0)return {...hotel,totalIncludesTaxAndFees:false};
  return hotel;
}
export function bookingFeatureMetadata(property){
  const keys=['free_cancellation','free_cancellation_until','meal_plan','breakfast_included','parking','parking_available','free_parking','amenities'];
  return {...Object.fromEntries(keys.filter(key=>Object.hasOwn(property,key)).map(key=>[key,property[key]])),photos:hotelPhotos(property)};
}
export function createHotelFeatureArchiveReader(load,{ttlMs=10*60*1000,maxEntries=32}={}){
  const cache=new Map();
  return async id=>{
    if(!/^[a-f0-9]{24}$/i.test(id||''))return new Map();
    let entry=cache.get(id);
    if(!entry||entry.expires<=Date.now()){
      const promise=Promise.resolve().then(()=>load(id)).then(result=>new Map((result.properties||[]).filter(p=>p.property_id!=null).map(p=>[String(p.property_id),bookingFeatureMetadata(p)]))).catch(()=>new Map());
      entry={expires:Date.now()+ttlMs,promise};cache.set(id,entry);
      while(cache.size>maxEntries)cache.delete(cache.keys().next().value);
    }
    return entry.promise;
  };
}
const readArchive=createHotelFeatureArchiveReader(async id=>{
  // Archive retrieval is a free read, never a new /search request or a paid fallback.
  if(!process.env.SERPAPI_API_KEY||process.env.NODE_ENV==='test')return {};
  const url=new URL(`https://serpapi.com/searches/${id}.json`);url.searchParams.set('api_key',process.env.SERPAPI_API_KEY);
  const response=await fetch(url,{signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error('Archive unavailable');
  return response.json();
});
export async function recoverStoredHotelFeatures(hotels,reader=readArchive){
  return Promise.all(hotels.map(async hotel=>{
    if(hotel.source!=='serpapi_booking'||hotel.propertyId==null||!hotel.searchId||hotel.rawRateMetadata?.featuresVersion===1&&(hotel.rawRateMetadata?.imagesVersion===1||hotelPhotos(hotel).length))return hotel;
    const archived=await reader(hotel.searchId),features=archived.get(String(hotel.propertyId));
    if(!features)return hotel;
    return {...hotel,images:hotelPhotos({photos:[...hotelPhotos(hotel),...(features.photos||[])]}),rawRateMetadata:{...hotel.rawRateMetadata,features:{...features,...(hotel.rawRateMetadata?.featuresVersion===1?hotel.rawRateMetadata.features:{})},featuresVersion:1,imagesVersion:1}};
  }));
}
