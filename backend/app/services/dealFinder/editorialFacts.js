import {stayTotal,nights,hostelFeatures} from './domain.js';
import {airportByCode} from './airports.js';
import {editorialMoney as money,editorialShortMoney as shortMoney} from './editorialMoney.js';

// The selected stay, rather than a remembered exampleIndex or a verification
// timer, identifies the flight used for the editorial package calculation.
export function flightForStay(offer,hotel){
  if(!hotel)return null;
  const selected=offer.selection?.flightIndices||[];
  return (offer.data?.flights||[]).map((flight,index)=>({flight,index}))
    .filter(({flight:f})=>f.available!==false&&Number.isInteger(f.priceCents)&&f.priceCents>0&&
      (!offer.origin||!f.origin||f.origin===offer.origin)&&(!offer.destination||!f.destination||f.destination===offer.destination)&&
      (f.arrivalDate||f.departureDate)===hotel.checkin&&(f.returnLocalDate||f.returnDate)===hotel.checkout)
    .sort((a,b)=>Number(selected.includes(b.index))-Number(selected.includes(a.index))||a.flight.priceCents-b.flight.priceCents)[0]||null;
}

export function editorialFacts(offer){
  const tokens={},selection=offer.selection||{},data=offer.data||{};
  const fresh=item=>Boolean(item?.available===true&&item.verifiedAt);
  const indices=selection.template==='monthly'?[]:[selection.hotelIndex,...(selection.extraHotelIndices||[])].filter(Number.isInteger);
  const hotels=indices.map((index,position)=>{
    const hotel=data.hotels?.[index];if(!hotel)return null;
    const total=fresh(hotel)?stayTotal(hotel):null;
    const features=[];
    if(hotel.freeCancellation===true&&(!hotel.cancellationDeadline||Date.parse(hotel.cancellationDeadline)>Date.now()))features.push('besplatno otkazivanje');
    if(hotel.breakfast===true)features.push('uključen doručak');
    if(hotel.freeParking===true)features.push('besplatan parking');else if(hotel.parking===true)features.push('parking');
    const prefix=position===0?'hotel':`alternative_${position}`;
    tokens[`${prefix}_name`]=String(hotel.name||'Smještaj').slice(0,200);
    if(total!==null){
      tokens[`${prefix}_price`]=`${money(total)} za cijeli boravak za ${hotel.adults} osobe`;
      tokens[`${prefix}_price_short`]=shortMoney(total);
      tokens[`${prefix}_price_person`]=`${shortMoney(Math.round(total/hotel.adults))} po osobi`;
      tokens[`${prefix}_price_person_short`]=shortMoney(Math.round(total/hotel.adults));
      tokens[`${prefix}_nights`]=String(nights(hotel.checkin,hotel.checkout));
      tokens[`${prefix}_guests`]=String(hotel.adults);
    }
    tokens[`${prefix}_features`]=features.join(', ');
    return {role:position===0?'primary':'alternative',name:tokens[`${prefix}_name`],checkin:hotel.checkin,checkout:hotel.checkout,nights:nights(hotel.checkin,hotel.checkout),adults:hotel.adults,totalPriceCents:total,features};
  }).filter(Boolean);
  const flights=(selection.flightIndices||[]).map(index=>data.flights?.[index]).filter(Boolean),priced=flights.filter(fresh).sort((a,b)=>a.priceCents-b.priceCents);
  const roundup=selection.template==='roundup';
  const destinations=[...new Set(flights.map(f=>f.destination))].map(code=>({code,name:airportByCode(code)?.city||code}));
  const hostel=selection.hostel?.adults===2?selection.hostel:null;
  if(hostel){
    tokens.hostel_price=`${money(Math.round(hostel.totalEur*100))} za cijeli boravak za dvije osobe`;
    tokens.hostel_price_person=`${money(Math.round(hostel.totalEur*100/2))} po osobi`;
    tokens.hostel_features=hostelFeatures(hostel).join(', ');
    tokens.hostel_nights=String(nights(hostel.checkin,hostel.checkout));
  }
  if(selection.template==='monthly'||roundup){
    tokens.destination_count=String(new Set(flights.map(f=>f.destination)).size);
    tokens.flight_count=String(flights.length);
    if(/^\d{4}-\d{2}$/.test(selection.month||''))tokens.travel_month=`${Number(selection.month.slice(5))}. mjesec`;
  }
  if(priced.length){tokens.flight_price=`${money(priced[0].priceCents)} povratno po osobi`;tokens.flight_price_short=shortMoney(priced[0].priceCents);}
  const main=hotels[0],matching=main?flightForStay(offer,main)?.flight:null;
  const focus=matching||flights[selection.exampleIndex||0];
  if(matching&&main.totalPriceCents!==null){
    const total=matching.priceCents+Math.round(main.totalPriceCents/main.adults);
    tokens.package_price=`${money(total)} po osobi`;tokens.package_price_short=shortMoney(total);
    tokens.stay_nights=String(main.nights);
    tokens.stay_days=String(main.nights+1);
    tokens.focus_flight_price=shortMoney(matching.priceCents);
  }
  if(focus?.departureDate){tokens.travel_year=focus.departureDate.slice(0,4);tokens.travel_month=`${Number(focus.departureDate.slice(5,7))}. mjesec`;}
  if(focus?.returnDate)tokens.return_year=focus.returnDate.slice(0,4);
  if(roundup&&flights.length){
    tokens.travel_start=flights.map(f=>f.departureDate).sort()[0];
    tokens.travel_end=flights.map(f=>f.returnDate).sort().at(-1);
    if(tokens.travel_start.slice(0,7)!==tokens.travel_end.slice(0,7))delete tokens.travel_month;
  }
  tokens.headline_price=tokens.package_price_short||tokens.flight_price_short||'';
  const advent=roundup?flights.length>0&&flights.every(f=>f.departureDate>=`${tokens.travel_start.slice(0,4)}-11-25`&&f.returnDate<=`${tokens.travel_start.slice(0,4)}-12-25`):focus?.departureDate&&focus.departureDate.slice(5)>='11-25'&&focus.departureDate.slice(5)<='12-25';
  return {tokens,context:{template:selection.template||'route',originAirport:offer.origin,originName:airportByCode(offer.origin)?.city||offer.origin,destinationAirport:offer.destination,destinationName:roundup?'Više odredišta':data.destinationName||airportByCode(offer.destination)?.city||offer.destination,...(roundup?{destinations,travelWindow:{start:tokens.travel_start,end:tokens.travel_end}}:{}),
    seasonalAngle:advent?'Advent':null,
    editorialNotes:offer.destination==='ACE'?'Lanzarote je kanarski otok u Atlantskom oceanu, dio Španjolske. Vulkanima oblikovan krajolik, šetnje i obalna mjesta daju razlog za posjet; zimi je zanimljiv kao bijeg u blažu klimu. Bez izmišljenih temperatura i tvrdnji o Mediteranu.':null,
    packageFlight:matching?{departureDate:matching.departureDate,returnDate:matching.returnDate,priceCents:matching.priceCents,verified:fresh(matching)}:null,
    flights:flights.map(f=>({destinationName:airportByCode(f.destination)?.city||f.destination,departureDate:f.departureDate,returnDate:f.returnDate,airline:f.airline||null,outboundAirlineCode:f.outboundAirlineCode||null,inboundAirlineCode:f.inboundAirlineCode||null})),hotels,hostel:hostel?{checkin:hostel.checkin,checkout:hostel.checkout,adults:2,totalEur:hostel.totalEur,features:hostelFeatures(hostel),cheaperThanHotels:hotels.length>0&&hotels.every(h=>h.totalPriceCents!==null&&hostel.totalEur*100<h.totalPriceCents)}:null}};
}
export function editorialSnapshot(offer){
  const selection=offer.selection||{},data=offer.data||{};
  return JSON.stringify({selection,flights:(selection.flightIndices||[]).map(i=>data.flights?.[i]),stayFlight:selection.template==='monthly'||selection.flightsOnly?null:flightForStay(offer,data.hotels?.[selection.hotelIndex])?.flight,hotels:selection.template==='monthly'?[]:[selection.hotelIndex,...(selection.extraHotelIndices||[])].filter(Number.isInteger).map(i=>data.hotels?.[i])});
}
