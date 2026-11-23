const normalize=value=>String(value||'').trim().toLowerCase();
function propertyKey(hotel){
 if(hotel.propertyId!=null&&String(hotel.propertyId)!=='')return ['id',String(hotel.propertyId)];
 try{const url=new URL(hotel.bookingUrl);return ['url',url.hostname.toLowerCase(),url.pathname.replace(/\/$/,'')];}catch{/* Older results may have no property URL. */}
 const hasCoordinates=hotel.gpsCoordinates?.latitude!=null&&hotel.gpsCoordinates?.longitude!=null;
 return ['name',normalize(hotel.name),hotel.gpsCoordinates?.latitude??null,hotel.gpsCoordinates?.longitude??null,...(hasCoordinates?[]:[normalize(hotel.searchPlace)])];
}
const hotelKey=hotel=>JSON.stringify([propertyKey(hotel),hotel.checkin,hotel.checkout,hotel.adults??2,hotel.rooms??1]);

// Never reorder/remove existing entries: saved selections refer to their indices.
export function mergeHotelResults(existing,incoming,{previousPlace,place}={}){
 const hotels=existing.map(h=>({...h,searchPlace:h.searchPlace||previousPlace||''}));
 const indices=new Map(hotels.map((h,index)=>[hotelKey(h),index]));
 for(const item of incoming){
  const hotel={...item,searchPlace:place||item.searchPlace||''},key=hotelKey(hotel),index=indices.get(key);
  if(index===undefined){indices.set(key,hotels.length);hotels.push(hotel);}
  // Manual price and amenity confirmation belongs to this exact stay. A new
  // API result must not replace those editorial decisions with estimates.
  else if(!hotels[index].verifiedAt&&!hotels[index].editorApproved)hotels[index]={...hotels[index],...hotel};
 }
 return hotels;
}
