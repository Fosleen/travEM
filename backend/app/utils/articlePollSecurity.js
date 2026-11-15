import crypto from 'node:crypto';
import {createCommentFormToken,verifyCommentSubmission} from './commentFormToken.js';
import {moderateComment} from './commentModeration.js';
import {pollKey} from '../../../client/utils/articlePoll.mjs';
export function pollError(message,status=400){return Object.assign(new Error(message),{status});}
const secret=()=>process.env.COMMENT_FORM_SECRET||process.env.JWT_SECRET_KEY;
export const pollToken=(id,voterHash)=>createCommentFormToken(`destination-poll:${id}:${voterHash}`);
export function checkPollSubmission(id,body,voterHash){
  const checked=verifyCommentSubmission(body,`destination-poll:${id}:${voterHash}`);
  if(!checked)throw pollError('Glasanje nije potvrđeno. Osvježi članak i pokušaj ponovno.',403);
  if(checked.tooFast)throw pollError('Pričekaj trenutak prije glasanja.',429);
}
export function pollVoterHash(id,ip){
  if(!secret()||!ip)throw pollError('Glasanje trenutačno nije dostupno.',503);
  return crypto.createHmac('sha256',secret()).update(`destination-poll-voter:${id}:${ip}`).digest('hex');
}
export function pollLabel(value){
  if(typeof value!=='string')throw pollError('Unesi naziv destinacije.');
  const label=value.trim().replace(/\s+/g,' ');
  if(label.length<2||label.length>60||! /^[\p{L}\p{M}][\p{L}\p{M}\p{N} .,'’()\-]+$/u.test(label))throw pollError('Naziv destinacije mora imati 2 do 60 znakova, bez poveznica ili HTML-a.');
  if(moderateComment({username:'posjetitelj',email:'',body:label}).status!=='published')throw pollError('Taj prijedlog nije prihvaćen. Unesi samo naziv destinacije.');
  return {label,key:pollKey(label)};
}
export function requirePollOrigin(req,res,next){
  const allowed=new Set(['https://www.putujemstravem.com','https://putujemstravem.com',...(process.env.POLL_ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean)]);
  if(process.env.NODE_ENV!=='production'){allowed.add('http://localhost:3000');allowed.add('http://127.0.0.1:3000');}
  if(!allowed.has(req.get('origin')))return res.status(403).json({error:'Glasanje je dopušteno samo preko bloga.'});
  next();
}
export function pollPercentages(counts){
  const total=counts.reduce((sum,n)=>sum+n,0);if(!total)return counts.map(()=>0);
  const exact=counts.map(n=>100*n/total),result=exact.map(Math.floor);
  const order=exact.map((value,index)=>({index,remainder:value-result[index]})).sort((a,b)=>b.remainder-a.remainder||a.index-b.index);
  const remaining=100-result.reduce((sum,n)=>sum+n,0);
  for(let i=0;i<remaining;i++)result[order[i].index]++;
  return result;
}
