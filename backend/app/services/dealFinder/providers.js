import { cents, date } from './domain.js';
import {discoveryQueries,matchesSearch,routeParams,dateSpan,isDiscoveryBudgetCarrier} from './searchRules.js';
import {discoveryDestinationAllowed,excludedDiscoveryCountries,offerAirportNames} from './airports.js';
import {searchBudgetDates} from './budgetDates.js';
import {bookingHotelFeatures,bookingFeatureMetadata,hotelPhotos} from './hotels.js';
import {flightBaggageDetails} from './baggage.js';

// Interfaces are deliberately small: search(input) -> normalized data + provenance.
// No provider response or request URL containing a credential is persisted.
export class SerpApiProvider {
  constructor(request) { this.request=request; }
  async search(input) {
    if(input.mode==='budget_dates')return searchBudgetDates(this.request,input);
    const flights=[],hotels=[];
    let metadata={};
    if(input.mode==='hotels') {
      const threshold=[9,8,7,6].find(x=>x<=input.minRating);
      const p=await this.request('booking',{q:input.place,check_in_date:input.checkin,check_out_date:input.checkout,adults:2,rooms:input.rooms,currency:'EUR',...(threshold?{rating:threshold}:{}),sort_by:'price',limit:100});
      metadata={searchId:p.search_metadata?.id,retrievedAt:new Date().toISOString(),prefilter:threshold??null};
      for(const h of p.properties||[]) hotels.push({name:h.name,propertyId:h.property_id,propertyType:h.type,bookingUrl:h.link,gpsCoordinates:h.gps_coordinates,rating:h.rating,ratingScale:10,reviews:h.reviews,
        checkin:h.check_in_date||input.checkin,checkout:h.check_out_date||input.checkout,adults:2,rooms:input.rooms,
        totalEur:h.currency==='EUR'?h.extracted_price??null:null,totalIncludesTaxAndFees:h.currency==='EUR'&&typeof h.extracted_taxes_and_fees==='number'&&Number.isFinite(h.extracted_taxes_and_fees)&&h.extracted_taxes_and_fees>=0?false:/^(?:includes|including) taxes and fees$/i.test(h.price_disclaimer||'')?true:null,additionalTaxesFeesEur:h.currency==='EUR'?h.extracted_taxes_and_fees??null:null,
        images:hotelPhotos(h),rawRateMetadata:{rooms:h.rooms||[],taxesAndFees:h.taxes_and_fees||null,currency:h.currency,priceDisclaimer:h.price_disclaimer||null,features:bookingFeatureMetadata(h),featuresVersion:1,imagesVersion:1},
        ...bookingHotelFeatures(h),available:h.sold_out?false:null,ratePolicyVerified:false,source:'serpapi_booking',searchId:metadata.searchId});
    } else {
      const calendar=input.mode==='calendar'||input.mode==='route';
      metadata={coverage:calendar?'route_calendar':'discovery_highlights',retrievedAt:new Date().toISOString()};
      if(!calendar)metadata.discoveryStrategy=input.discoveryStrategy||'broad';
      if(!calendar)metadata.excludedCountriesByOrigin=Object.fromEntries(input.origins.map(origin=>[origin,excludedDiscoveryCountries(origin)]));
      for(const origin of input.origins) {
       const queries=input.mode==='route'?routeParams(input,origin):input.mode==='calendar'?(input.durations||[input.days]).map(days=>({
          departure_id:origin,arrival_id:input.destination,date_range_start:input.start,date_range_end:input.end,round_trip_days:days,type:1,currency:'EUR',adults:1
        })):discoveryQueries(input,origin);
       for(const params of queries) {
        const p=await this.request(calendar?'google_flights_calendar':'google_flights_deals',params);
        for(const d of (calendar?p.prices:p.deals)||[]) {
          const o=d.departure_airport_code || origin, destination=calendar?params.arrival_id:d.arrival_airport_code;
          if(o!==origin || !/^[A-Z]{3}$/.test(destination||'') || !(Number(d.price)>0)) continue;
          if(!calendar&&!discoveryDestinationAllowed(origin,destination))continue;
          if(!calendar&&input.discoveryStrategy==='cheap_first'){
            const budget=isDiscoveryBudgetCarrier(d);
            if(!budget&&offerAirportNames({destination}).outsideEurope!==true)continue;
          }
          const departureDate=d.outbound_date||d.start_date,returnDate=d.return_date||d.end_date;
          try {date(departureDate);date(returnDate);if(input.mode==='calendar'&&dateSpan(departureDate,returnDate)!==Number(params.round_trip_days))continue;}catch{continue;}
          const flight={origin:o,destination,destinationName:d.name||null,departureDate,returnDate,priceCents:cents(d.price),airline:d.airline||null,stops:d.stops??null,available:null,verifiedAt:null,source:calendar?'google_flights_calendar':'google_flights_deals',searchId:p.search_metadata?.id,retrievedAt:new Date().toISOString()};
          if(typeof d.airline_code==='string'&&/^[A-Z0-9]{2}$/.test(d.airline_code))flight.airlineCode=d.airline_code;
          const baggage=flightBaggageDetails(d);if(baggage.length)flight.baggageDetails=baggage;
          if(Number.isInteger(d.outbound_stops)&&d.outbound_stops>=0)flight.outboundStops=d.outbound_stops;
          if(Number.isInteger(d.return_stops)&&d.return_stops>=0)flight.inboundStops=d.return_stops;
          if(!calendar&&Number.isFinite(Number(d.average_price))&&Number(d.average_price)>0)flight.averagePriceCents=cents(d.average_price);
          if(matchesSearch(flight,input))flights.push(flight);
        }
       }
      }
    }
    const unique=new Map();
    for(const flight of flights){
      const key=`${flight.origin}:${flight.destination}:${flight.departureDate}:${flight.returnDate}`,previous=unique.get(key);
      if(!previous||flight.priceCents<previous.priceCents)unique.set(key,flight);
    }
    return {flights:[...unique.values()],hotels,metadata};
  }
}
