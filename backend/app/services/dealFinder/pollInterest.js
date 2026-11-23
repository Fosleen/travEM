import {pollKey} from '../../../../client/utils/articlePoll.mjs';
import {accommodationDestination,airportByCode} from './airports.js';

export function offerPollMatcher(polls){
  const votesByLabel=new Map();
  for(const poll of polls){
    for(const option of poll.options){
      const key=pollKey(option.label);
      votesByLabel.set(key,(votesByLabel.get(key)||0)+option.votes);
    }
  }
  return offer=>{
    const destinations=offer.destinations??[{code:offer.destination,name:offer.destinationName}];
    const keysByDestination=new Map();
    for(const {code,name} of destinations){
      const airport=airportByCode(code);
      const destination=airport?accommodationDestination(code):name||code;
      const keys=keysByDestination.get(destination)??new Set();
      for(const label of [destination,code,name,airport?.name,...(airport?.aliases??[])]){
        if(label)keys.add(pollKey(label));
      }
      keysByDestination.set(destination,keys);
    }
    return Array.from(keysByDestination,([destination,keys])=>({
      destination,
      votes:Array.from(keys).reduce((total,key)=>total+(votesByLabel.get(key)||0),0),
    })).filter(match=>match.votes>0);
  };
}
