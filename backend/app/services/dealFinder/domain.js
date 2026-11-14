import {maltaScope} from './geography.js';
export const defaults = {
  scheduleEnabled: false, scheduleTime:'08:00', scheduleFrequency:'odd', scheduleIntervalDays:2, originsPerRun: 2,
  monthlyCap: 200, reserve: 50, maxQueries: 10,
  cheapDiscoveryMaxEur: 100,
  lowCostPairingEnabled: false,
  minRating: 7, minReviews: 50, freeCancellationOnly: false,
  cancellationBonus: 25, destinationOverrides: {MLA:{scope:maltaScope}},
  trackingHost: 'www.dpbolvw.net', publisherId: '101820293', linkId: '15735418',
  mediaPartnerId: '6483817', aiEnabled: false,
  hostelHosts: ['www.hostelworld.com','hostelworld.com','hostelworld.prf.hn'],
  airlinePolicies: [],
  verifiedClickAttribution: false,
};
export function assert(ok, message) { if (!ok) throw new Error(message); }
export function date(value) {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(value || ''), 'Datum mora biti YYYY-MM-DD');
  assert(new Date(value + 'T00:00:00Z').toISOString().slice(0,10) === value, 'Neispravan datum');
  return value;
}
export function nights(a,b) { const n=(Date.parse(date(b))-Date.parse(date(a)))/86400000; assert(n>0,'Odlazak mora biti nakon dolaska'); return n; }
export function cents(n) { assert(n!==null && n!=='' && Number.isFinite(Number(n)) && Number(n)>=0,'Neispravan iznos'); return Math.round(Number(n)*100); }
export const money = n => (n/100).toLocaleString('hr-HR',{style:'currency',currency:'EUR'});
export function stayTotal(h) {
  if (typeof h.totalIncludesTaxAndFees !== 'boolean' || h.totalEur == null) return null;
  if (!h.totalIncludesTaxAndFees && h.additionalTaxesFeesEur == null) return null;
  return cents(h.totalEur)+(h.totalIncludesTaxAndFees ? 0 : cents(h.additionalTaxesFeesEur));
}
export function rating(h) { return [5,10].includes(h.ratingScale) && h.rating>=0 && h.rating<=h.ratingScale ? h.rating*10/h.ratingScale : null; }
export function cancellable(h) { return h.freeCancellation===true && h.ratePolicyVerified===true && (!h.cancellationDeadline || Date.parse(h.cancellationDeadline)>Date.now()); }
export function pointInPolygon(lat,lon,p) {
  let inside=false;
  for(let i=0,j=p.length-1;i<p.length;j=i++) {
    const [x,y]=p[i], [u,v]=p[j];
    if(Math.abs((lon-x)*(v-y)-(lat-y)*(u-x))<1e-10 && lon>=Math.min(x,u) && lon<=Math.max(x,u) && lat>=Math.min(y,v) && lat<=Math.max(y,v)) return null;
    if((y>lat)!==(v>lat) && lon<(u-x)*(lat-y)/(v-y)+x) inside=!inside;
  }
  return inside;
}
export function geography(h,scope={}) {
  const g=h.gpsCoordinates;
  if(!g || !Number.isFinite(g.latitude) || !Number.isFinite(g.longitude)) return 'needs_location_review';
  if(scope.polygon) { const r=pointInPolygon(g.latitude,g.longitude,scope.polygon); return r===null?'boundary_review':r?'included':'outside_scope'; }
  if(scope.center && scope.radiusKm) {
    const rad=x=>x*Math.PI/180, [lat,lon]=scope.center;
    const a=Math.sin(rad(g.latitude-lat)/2)**2+Math.cos(rad(lat))*Math.cos(rad(g.latitude))*Math.sin(rad(g.longitude-lon)/2)**2;
    return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))<=scope.radiusKm?'included':'outside_scope';
  }
  return 'scope_review_required';
}
export function evaluateStay(h,s=defaults) {
  const reasons=[]; const total=stayTotal(h), score=rating(h), geo=geography(h,s.scope);
  if(h.editorApproved===true){
    if(total===null)reasons.push('needs_price_review');if(h.available===false)reasons.push('unavailable');
    return {total,score,geo,reasons,rank:(score||0)*10-(total||0)/1000+(cancellable(h)?s.cancellationBonus:0)};
  }
  if(total===null) reasons.push('needs_price_review');
  if(score===null || score<s.minRating) reasons.push('rating_below_threshold_or_unknown');
  if(h.reviews<s.minReviews || !Number.isFinite(h.reviews)) reasons.push('too_few_reviews');
  if(geo!=='included') reasons.push(geo);
  if(s.scope?.reviewed!==true) reasons.push('geometry_not_reviewed');
  if(h.available===false) reasons.push('unavailable');
  if(h.verifiedAt && (h.ratePolicyVerified!==true || typeof h.freeCancellation!=='boolean')) reasons.push('needs_rate_policy_review');
  if(s.freeCancellationOnly && !cancellable(h)) reasons.push('cancellation_not_confirmed_for_rate');
  return {total,score,geo,reasons,rank:(score||0)*10-(total||0)/1000+(cancellable(h)?s.cancellationBonus:0)};
}
export function skyscanner(f,s=defaults,adults=1) {
  assert(/^[A-Z]{3}$/.test(f.origin) && /^[A-Z]{3}$/.test(f.destination),'Neispravan IATA kod');
  nights(f.departureDate,f.returnDate);
  const u=new URL('https://skyscanner.net/g/referrals/v1/flights/day-view/');
  u.search=new URLSearchParams({origin:f.origin,destination:f.destination,outboundDate:f.departureDate,inboundDate:f.returnDate,adultsv2:String(adults),cabinclass:'economy',currency:'EUR',mediaPartnerId:s.mediaPartnerId}).toString();
  if(['sum_of_oneways_estimate','verified_round_trip','round_trip_search'].includes(f.priceBasis)) {
    const codes=(f.airlineCodes||[f.airlineCode]).filter(code=>typeof code==='string'&&/^[A-Z0-9]{2}$/.test(code));
    if(codes.length)u.searchParams.set('airlines',[...new Set(codes)].join(','));
    u.searchParams.set('sortby','cheapest');
  }
  return u.href;
}
export function bookingLink(input,s=defaults) {
  const u=new URL(input);
  assert(u.protocol==='https:' && ['booking.com','www.booking.com'].includes(u.hostname) && !u.username && !u.password && !u.port,'Nedozvoljen Booking URL');
  assert(['www.dpbolvw.net','www.jdoqocy.com'].includes(s.trackingHost),'Nedozvoljen CJ host');
  assert(/^\d+$/.test(s.publisherId) && /^\d+$/.test(s.linkId),'Neispravni CJ identifikatori');
  const allowed=['checkin','checkout','group_adults','group_children','no_rooms','lang','selected_currency'];
  for(const k of [...u.searchParams.keys()]) if(!allowed.includes(k)) u.searchParams.delete(k);
  u.hash=''; const out=new URL(`https://${s.trackingHost}/click-${s.publisherId}-${s.linkId}`); out.searchParams.set('url',u.href); return out.href;
}
export function hotelBookingLink(hotel,s=defaults){
  const url=new URL(hotel.bookingUrl);
  nights(hotel.checkin,hotel.checkout);
  const rooms=hotel.rooms??1;assert(Number.isInteger(rooms)&&rooms>=1&&rooms<=4,'Neispravan broj soba');
  for(const [key,value] of Object.entries({checkin:hotel.checkin,checkout:hotel.checkout,group_adults:2,group_children:0,no_rooms:rooms,selected_currency:'EUR'}))url.searchParams.set(key,String(value));
  return bookingLink(url.href,s);
}
export function scheduleKey(now,s=defaults,lastScheduledDate=null) {
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Zagreb',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));
  const current=`${p.year}-${p.month}-${p.day}`,[hour,minute]=(s.scheduleTime||defaults.scheduleTime).split(':').map(Number);
  if(Number(p.hour)*60+Number(p.minute)<hour*60+minute)return null;
  const frequency=s.scheduleFrequency||'odd';
  if(frequency==='odd'&&Number(p.day)%2!==1||frequency==='even'&&Number(p.day)%2!==0)return null;
  if(frequency==='interval'&&lastScheduledDate){
    const elapsed=(Date.parse(current)-Date.parse(lastScheduledDate))/86400000;
    if(!Number.isFinite(elapsed)||elapsed<(s.scheduleIntervalDays||2))return null;
  }
  return current;
}
export function normalizeSettings(value={}){
  const {enabled,ttlMinutes,adminHomeTab,hour,minute,...current}=value;
  void enabled;void ttlMinutes;void adminHomeTab;
  const scheduleTime=current.scheduleTime??(Number.isInteger(hour)&&Number.isInteger(minute)?`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`:defaults.scheduleTime);
  return {...defaults,...current,scheduleTime};
}
export function validateSettings(s) {
  assert(s && typeof s==='object' && !Array.isArray(s),'Postavke moraju biti objekt');
  s=normalizeSettings(s);
  assert(Object.keys(s).every(k=>Object.hasOwn(defaults,k)),'Nepoznata postavka; tajne ključeve držite u server okruženju');
  for(const [k,min,max] of [['scheduleIntervalDays',1,365],['originsPerRun',1,12],['monthlyCap',0,250],['reserve',0,250],['maxQueries',1,30],['minRating',0,10],['minReviews',0,100000],['cancellationBonus',0,100]]) assert(typeof s[k]==='number' && Number.isFinite(s[k]) && s[k]>=min && s[k]<=max,`Neispravna postavka: ${k}`);
  assert(s.monthlyCap+s.reserve<=250,'Kvota i rezerva prelaze 250');
  assert(Number.isInteger(s.cheapDiscoveryMaxEur)&&s.cheapDiscoveryMaxEur>=1&&s.cheapDiscoveryMaxEur<=5000,'Prag jeftinog discovery upita mora biti 1–5000 EUR');
  for(const k of ['scheduleIntervalDays','originsPerRun','monthlyCap','reserve','maxQueries','minReviews']) assert(Number.isInteger(s[k]),`Postavka mora biti cijeli broj: ${k}`);
  for(const k of ['scheduleEnabled','freeCancellationOnly','aiEnabled','lowCostPairingEnabled']) assert(typeof s[k]==='boolean',`Neispravna postavka: ${k}`);
  assert(['odd','even','interval'].includes(s.scheduleFrequency),'Nepoznata učestalost rasporeda');
  assert(/^([01]\d|2[0-3]):[0-5]\d$/.test(s.scheduleTime),'Odaberi valjano vrijeme rasporeda');
  bookingLink('https://www.booking.com/',s);
  for(const override of Object.values(s.destinationOverrides)) validateOverrides(override);
  assert(Array.isArray(s.hostelHosts) && s.hostelHosts.every(h=>/^[a-z0-9.-]+$/.test(h)),'Neispravna hostel host allowlista');
  assert(Array.isArray(s.airlinePolicies),'Registar politika mora biti niz');
  for(const p of s.airlinePolicies) {assert(p.carrier && p.fareCode && p.note && p.sourceUrl?.startsWith('https://'),'Politika treba aviokompaniju, tarifu, tekst i izvor');date(p.reviewedAt);date(p.validUntil);}
  return s;
}
export function validateOverrides(s={}) {
  assert(s && typeof s==='object' && !Array.isArray(s),'Neispravne override postavke');
  assert(Object.keys(s).every(k=>['scope','minRating','minReviews','freeCancellationOnly','cancellationBonus'].includes(k)),'Nepodržan override ključ');
  if(s.minRating!==undefined) assert(Number.isFinite(s.minRating) && s.minRating>=0 && s.minRating<=10,'Ocjena mora biti 0–10');
  if(s.minReviews!==undefined) assert(Number.isInteger(s.minReviews) && s.minReviews>=0,'Neispravan broj recenzija');
  if(s.freeCancellationOnly!==undefined) assert(typeof s.freeCancellationOnly==='boolean','Otkazivanje mora biti boolean');
  if(s.cancellationBonus!==undefined) assert(Number.isFinite(s.cancellationBonus) && s.cancellationBonus>=0 && s.cancellationBonus<=100,'Neispravna težina otkazivanja');
  if(s.scope) {
    assert(['city','island','region','custom'].includes(s.scope.type),'Nepoznat geografski scope');
    if(s.scope.polygon) assert(Array.isArray(s.scope.polygon) && s.scope.polygon.length>=3 && s.scope.polygon.every(p=>Array.isArray(p) && p.length===2 && p.every(Number.isFinite) && Math.abs(p[0])<=180 && Math.abs(p[1])<=90),'Neispravan poligon');
    else assert(Array.isArray(s.scope.center) && s.scope.center.length===2 && s.scope.center.every(Number.isFinite) && s.scope.radiusKm>0 && s.scope.radiusKm<=100,'Unesite centar i polumjer');
    if(s.scope.reviewed) assert(s.scope.source?.length>5,'Pregledana geografija treba izvor');
  }
  return s;
}
export function effectiveSettings(global,destination,search={}) { return {...global,...global.destinationOverrides[destination],...validateOverrides(search)}; }
export const escapeHtml = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function editorial(offer,formatMoney=money) {
  const destinations={MLA:['Malta','Maltu','na Malti'],FCO:['Rim','Rim','u Rimu'],CIA:['Rim','Rim','u Rimu'],CDG:['Pariz','Pariz','u Parizu'],BVA:['Pariz','Pariz','u Parizu'],IST:['Istanbul','Istanbul','u Istanbulu'],CFU:['Krf','Krf','na Krfu'],ACE:['Lanzarote','Lanzarote','na Lanzaroteu']};
  const destinationLabel=offer.destinationName||offer.data?.destinationName||offer.destination;
  const [destination,to,at]=destinations[offer.destination]||[destinationLabel,destinationLabel,`u destinaciji ${destinationLabel}`];
  const flights=offer.selection?.flightIndices?.map(i=>offer.data?.flights[i]).filter(Boolean)||[];
  const fresh=f=>f?.available===true && f.verifiedAt;
  const flight=flights.filter(fresh).sort((a,b)=>a.priceCents-b.priceCents)[0];
  const hotel=offer.data?.hotels?.[offer.selection?.hotelIndex];
  const total=hotel?stayTotal(hotel):null;
  const exampleFlight=flights[offer.selection?.exampleIndex||0];
  const stayAligned=hotel && fresh(exampleFlight) && hotel.checkin>=exampleFlight.departureDate && hotel.checkout<=exampleFlight.returnDate;
  const packagePrice=stayAligned && fresh(hotel) && hotel.ratePolicyVerified===true && typeof hotel.freeCancellation==='boolean' && total!==null && hotel.adults>0 ? formatMoney(exampleFlight.priceCents+Math.round(total/hotel.adults)) : null;
  const route=destination;
  const titles=[packagePrice?`${route}: povratni let i smještaj od ${packagePrice} po osobi`:`${route}: povratni letovi i ideja za sljedeći odmor`,flight?`Povratni letovi za ${to} od ${formatMoney(flight.priceCents)}`:`Vrijeme je za ${to}: odabrani termini povratnih letova`];
  const subtitles=[`Bijeg ${['MLA','CFU','ACE'].includes(offer.destination)?'na':'u'} ${to}`,flight?`Povratni letovi od ${formatMoney(flight.priceCents)}`:'Letovi i smještaj'];
  return {destinationName:destination,titles:titles.map(t=>t.slice(0,100)),subtitle:subtitles[0],subtitles,descriptions:[
    `${route}: odabrani termini povratnih letova i prijedlog smještaja.`,
    `Isplaniraj odmor ${at}. Pogledaj termine letova i odaberi smještaj za svoj boravak.`,
    `Istraži ${to} uz povratne letove. Cijene i dostupnost provjeri prije rezervacije.`
  ].map(d=>d.length<=100?d:`${route}: termini letova i smještaj.`.slice(0,100)),intro:offer.destination==='MLA'?'Valletta, kamene ulice Mdine i obala glavnog otoka nude nekoliko različitih načina za upoznavanje Malte. Za kraći boravak odaberite bazu prema mjestima koja želite posjetiti i provjerite prometne veze za svoje termine.':`Planirate putovanje ${at}? Odaberite bazu prema mjestima koja želite posjetiti i provjerite prometne veze za svoj termin.`,tags:`${destination}, ${offer.origin}, ${offer.destination}, letovi, putovanja`};
}
export function hostelFeatures(h) {
  return [h.roomType==='private_room'?'privatna soba':h.roomType==='shared_bed'?'kreveti u spavaonici':null,h.bathroom==='private'?'privatna kupaonica':h.bathroom==='shared'?'zajednička kupaonica':null,h.freeCancellation?'besplatno otkazivanje':null,h.breakfast?'uključen doručak':null,h.kitchen?'zajednička kuhinja':null,h.lockers?'ormarići za stvari':null].filter(Boolean);
}
export function renderHostel(h,s=defaults) {
  if(!h) return '';
  const u=new URL(h.url);assert(u.protocol==='https:' && !u.username && !u.password && (u.hostname==='hostelworld.prf.hn'||s.hostelHosts.includes(u.hostname)),'Hostel affiliate host nije odobren');
  if(h.adults===2){
    assert(typeof h.totalEur==='number'&&Number.isFinite(h.totalEur)&&h.totalEur>0,'Unesite ukupnu cijenu hostela za dvije osobe');
    assert(['shared_bed','private_room'].includes(h.roomType),'Odaberite privatnu sobu ili spavaonicu');
    assert(['unknown','private','shared'].includes(h.bathroom),'Neispravan tip kupaonice');
    for(const key of ['freeCancellation','breakfast','kitchen','lockers'])assert(typeof h[key]==='boolean','Neispravna pogodnost hostela');
    nights(h.checkin,h.checkout);
    return `<p>Hostelska opcija: ${nights(h.checkin,h.checkout)} noći za ${money(cents(h.totalEur))} ukupno za dvije osobe (${money(Math.round(cents(h.totalEur)/2))} po osobi). ${escapeHtml(hostelFeatures(h).join(', '))}.</p><p><a rel="sponsored noopener" href="${escapeHtml(u.href)}">Pogledaj hostel</a></p>`;
  }
  if(typeof h.description==='string') {
    assert(h.description.trim().length>0 && h.description.length<=3000,'Unesite opis odlomka hostela (najviše 3000 znakova)');
    return `<p>${escapeHtml(h.description)}</p><p><a rel="sponsored noopener" href="${escapeHtml(u.href)}">Pogledaj hostel</a></p>`;
  }
  assert(['shared_bed','private_room'].includes(h.roomType),'Navedite krevet u zajedničkoj sobi ili privatnu sobu');
  return `<p>Hostel alternativa: ${escapeHtml(h.name)}. ${h.roomType==='shared_bed'?'Krevet po osobi u zajedničkoj sobi':'Privatna soba'}. ${nights(h.checkin,h.checkout)} noći. ${h.verifiedAt && h.available===true?money(cents(h.totalEur)):'Cijena zahtijeva provjeru'}. <a rel="sponsored noopener" href="${escapeHtml(u.href)}">Pogledaj hostel</a></p>`;
}
export function renderSelection(offer,flights,hotel,s=defaults,formatMoney=money) {
  assert((flights.length || hotel) && flights.every(f=>f.origin===offer.origin),'Članak mora imati jedno polazište');
  const day=d=>new Date(date(d)+'T12:00:00Z').toLocaleDateString('hr-HR',{timeZone:'UTC',weekday:'long',day:'numeric',month:'numeric',year:'numeric'});
  const fresh=f=>f?.verifiedAt && f.available===true;
  const bullets=flights.map(f=>`<li>${escapeHtml(f.destination)}: <a rel="sponsored noopener" href="${escapeHtml(skyscanner(f,s))}">${escapeHtml(day(f.departureDate))} – ${escapeHtml(day(f.returnDate))}</a> | ${fresh(f) ? formatMoney(f.priceCents):'Cijena i dostupnost zahtijevaju provjeru'}</li>`).join('');
  let html=`<ul>${bullets}</ul>`;
  for(const p of s.airlinePolicies||[]) if(p.validUntil>=new Date().toISOString().slice(0,10) && flights.some(f=>f.airline===p.carrier && f.fareCode===p.fareCode)) html+=`<p>${escapeHtml(p.note)} <a href="${escapeHtml(p.sourceUrl)}" rel="noopener">Uvjeti tarife</a></p>`;
  if(hotel) { const total=stayTotal(hotel), verified=fresh(hotel) && total!==null && hotel.ratePolicyVerified===true && (hotel.editorApproved===true||typeof hotel.freeCancellation==='boolean');
    html+=`<p>${escapeHtml(hotel.name)}: ${nights(hotel.checkin,hotel.checkout)} noći za ${hotel.adults} osoba. ${verified?formatMoney(total):'Ukupna cijena zahtijeva provjeru.'}${verified && cancellable(hotel)?' Besplatno otkazivanje za odabranu tarifu'+(hotel.cancellationDeadline?' do '+escapeHtml(hotel.cancellationDeadline):'')+'.':''}${verified && hotel.breakfast===true?' Doručak je uključen.':''}${verified&&hotel.freeParking===true?' Dostupan je besplatan parking.':verified&&hotel.parking===true?' Dostupan je parking.':''}</p><p><a rel="sponsored noopener" href="${escapeHtml(hotelBookingLink(hotel,s))}">Pogledaj smještaj</a></p>`;
    const matching=flights.filter(f=>fresh(f)&&f.departureDate===hotel.checkin&&f.returnDate===hotel.checkout).sort((a,b)=>a.priceCents-b.priceCents)[0];
    if(verified && matching) html+=`<p>Let i smještaj po osobi: ${formatMoney(matching.priceCents+Math.round(total/hotel.adults))} (let po osobi + smještaj podijeljen na ${hotel.adults} osoba).</p>`;
  }
  return html+'<p>Poveznice su partnerske. Konačnu cijenu i uvjete provjerite kod prodavatelja prije rezervacije.</p>';
}
export function renderAlternativeHotels(offer,hotels,s=defaults){
  return hotels.length?'<h3>Alternativni smještaji</h3>'+hotels.map(hotel=>renderSelection(offer,[],hotel,s).replace('<ul></ul>','')).join(''):'';
}
