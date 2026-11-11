import {flightStopsLabel} from '@/utils/dealFinderFlights.mjs';
import type {DealJson} from '@/utils/dealFinder';
export default function FlightStopsBadge({flight}:{flight:DealJson}) {
  const label=flightStopsLabel(flight);
  return label?<small className="df-flight-stops">{label}</small>:null;
}
