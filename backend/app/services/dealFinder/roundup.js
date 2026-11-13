export const isRoundupOffer=offer=>offer.data?.type==='roundup';
export const flightKey=flight=>`${flight.origin}:${flight.destination}:${flight.departureDate}:${flight.returnDate}`;
export const destinationCodes=offer=>[...new Set((offer.data?.flights||[]).map(f=>f.destination).filter(Boolean))];
export function routeOffer(offer,destination){
  if(!isRoundupOffer(offer)){
    return offer;
  }
  if(!destinationCodes(offer).includes(destination))throw new Error('Odaberi odredište iz objedinjene ponude');
  const value=offer.toJSON?offer.toJSON():offer;
  return {...value,destination,data:{...value.data,flights:value.data.flights.filter(f=>f.destination===destination)}};
}
