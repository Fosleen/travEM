import {AirplaneTilt} from '@phosphor-icons/react';
import {flightCarrier} from '@/utils/dealFinderFlights.mjs';
import type {DealJson} from '@/utils/dealFinder';
import './AirlineBadge.scss';

const brands:[RegExp,string][]=[
  [/ryanair|^fr$/i,'ryanair'],[/wizz|^w[469]$/i,'wizz'],[/turkish|^tk$/i,'turkish'],
  [/easyjet|^u2$/i,'easyjet'],[/lufthansa|^lh$/i,'lufthansa'],[/croatia airlines|^ou$/i,'croatia'],
  [/eurowings|^ew$/i,'eurowings'],[/air serbia|^ju$/i,'air-serbia'],[/pegasus|^pc$/i,'pegasus'],
  [/air france|^af$/i,'air-france'],[/^klm|^kl$/i,'klm'],[/british airways|^ba$/i,'british'],
  [/emirates|^ek$/i,'emirates'],[/qatar|^qr$/i,'qatar'],[/austrian|^os$/i,'austrian'],
];
export default function AirlineBadge({flight}:{flight:DealJson}) {
  const name=flightCarrier(flight);
  const brand=name?brands.find(([pattern])=>pattern.test(name))?.[1]||'neutral':'unknown';
  return <span className={`df-airline-badge df-airline-${brand}`}><AirplaneTilt size={12} weight="fill" aria-hidden="true"/><span>{name||'Prijevoznik nije naveden'}</span></span>;
}
