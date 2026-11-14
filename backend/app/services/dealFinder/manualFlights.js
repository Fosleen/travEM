import {assert,date,nights} from './domain.js';
import {airportByCode} from './airports.js';
import {isRoundupOffer,destinationCodes} from './roundup.js';
import {confirmedPairFlight} from './budgetDates.js';
import {parseManualFlightLink} from '../../../../client/utils/dealFinderManualFlights.mjs';

export function manualFlight(offer,input){
  const destination=input.destination||offer.destination;
  assert(airportByCode(destination)&&destination!==offer.origin,'Odaberi odredišni aerodrom ponude.');
  assert(isRoundupOffer(offer)?destinationCodes(offer).includes(destination):destination===offer.destination,'Ručni let mora pripadati ruti ove ponude.');
  date(input.departureDate);date(input.returnDate);nights(input.departureDate,input.returnDate);
  assert(input.sourceUrl===undefined||typeof input.sourceUrl==='string'&&input.sourceUrl.length<=8192,'Skyscanner poveznica je preduga ili neispravna.');
  const source=input.sourceUrl?parseManualFlightLink(input.sourceUrl):null;
  if(source?.origin)assert(source.origin===offer.origin,'Polazište poveznice ne odgovara ponudi.');
  if(source?.destination&&airportByCode(source.destination))assert(source.destination===destination,'Odredišni aerodrom poveznice ne odgovara odabranoj ruti.');
  if(source?.departureDate)assert(source.departureDate===input.departureDate&&source.returnDate===input.returnDate,'Datumi poveznice ne odgovaraju unesenom terminu.');
  const flight=confirmedPairFlight({origin:offer.origin,destination,departureDate:input.departureDate,returnDate:input.returnDate},input);
  return {...flight,source:'manual_skyscanner',...(source?{sourceUrl:source.sourceUrl}:{})};
}
