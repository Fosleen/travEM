import { scheduledTick } from '../services/dealFinder/service.js';
export function startDealFinderJob() {
  if(process.env.NODE_ENV==='test') return;
  let running=false;
  const tick=async()=>{if(running)return;running=true;try{await scheduledTick();}catch{console.error('Deal Finder scheduler failed; inspect DB/migration and job history.');}finally{running=false;}};
  const timer=setInterval(tick,60000);timer.unref();tick();return timer;
}
