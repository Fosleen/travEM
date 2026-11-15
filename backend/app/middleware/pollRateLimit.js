import crypto from 'node:crypto';
import {redisAvailable,redisClient} from './redis.js';
const windowMs=600000,max=6,local=new Map();
export async function pollRateLimit(req,res,next){
  const key=crypto.createHash('sha256').update(req.ip||req.socket?.remoteAddress||'unknown').digest('hex'),now=Date.now();
  const reject=()=>{res.set('Retry-After','600');return res.status(429).json({error:'Previše pokušaja glasanja. Pokušaj ponovno za nekoliko minuta.'});};
  if(redisAvailable&&redisClient.isReady){try{const count=await redisClient.eval("local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]); end; return n",{keys:[`poll-rate:${key}`],arguments:[String(windowMs)]});if(Number(count)>max)return reject();return next();}catch{/* Same local fallback as comments. */}}
  for(const [entry,times] of local)if(!times.some(time=>now-time<windowMs))local.delete(entry);
  const times=(local.get(key)||[]).filter(time=>now-time<windowMs);
  if(times.length>=max||!local.has(key)&&local.size>=5000)return reject();
  local.set(key,[...times,now]);next();
}
