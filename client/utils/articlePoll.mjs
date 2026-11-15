import {isReadMoreSection} from './articleReadMore.mjs';
export const pollQuestion='Za koju destinaciju želiš sljedeću ponudu?';
export function pollInsertIndex(sections=[]){
  const lastBody=sections.reduce((last,section,index)=>!isReadMoreSection(section,section.section_images||[])?index:last,-1);
  return lastBody<0?sections.length-1:lastBody;
}
const destinations=['Prag','Rim','London','Istanbul','Lisabon','New York','Malta','Barcelona','Pariz','Lanzarote','Marakeš','Kopenhagen','Dublin','Krakow','Madeira','Bali','Bangkok','Valencia','Sevilla','Atena','Budimpešta'];
export const pollKey=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d').replace(/\s+/g,' ').trim();
export function defaultArticlePoll(article={}){
  const title=article.title||article.article_title||'';
  const tags=Array.isArray(article.metatags)?article.metatags.map(t=>t.metatag_text).join(' '):article.metatags||'';
  const text=pollKey([title,article.description||article.article_description,tags].join(' '));
  const seed=[...title].reduce((sum,char)=>(sum*31+char.charCodeAt(0))>>>0,0);
  const rotated=destinations.map((_,i)=>destinations[(i+seed%destinations.length)%destinations.length]);
  return {enabled:true,question:pollQuestion,options:rotated.filter(name=>!text.includes(pollKey(name))).slice(0,3).map(label=>({label}))};
}
export function articlePollForSave(values){
  const draft=values.destination_poll;
  if(!draft)return undefined;
  const config=draft.autoOptions?{...defaultArticlePoll(values),enabled:draft.enabled,question:draft.question}:draft;
  return {enabled:config.enabled,question:config.question,options:config.options.map(option=>({label:option.label}))};
}
