const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d').replace(/<[^>]*>/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const aliases={Rim:['Rome','Roma','Rima','Rimu'],Cipar:['Cyprus','Cipra','Cipru'],Prag:['Prague','Praga','Pragu'],Venecija:['Venice','Venezia','Veneciju','Veneciji'],Milano:['Milan','Milana','Milanu'],Bruxelles:['Brussels','Brisel','Briselu'],Malta:['Maltu','Malti'],London:['Londona','Londonu'],Lanzarote:['Lanzaroteu'],Pariz:['Paris','Pariza','Parizu'],Barcelona:['Barcelonu','Barceloni'],Krakow:['Krakova','Krakovu'],Budimpešta:['Budapest','Budimpeštu','Budimpešti'],Beč:['Vienna','Wien','Beča','Beču']};
const accusative={Malta:'Maltu',Venecija:'Veneciju',Barcelona:'Barcelonu',Budimpešta:'Budimpeštu',Španjolska:'Španjolsku',Italija:'Italiju',Francuska:'Francusku',Grčka:'Grčku',Hrvatska:'Hrvatsku'};
export function isReadMoreSection(section,images=[]){
  return section?.read_more_only===true||Boolean((section?.section_url_title||section?.link_title)&&(section?.section_url_link||section?.link_url)&&!normalize(section.section_text??section.text)&&!(section.section_subtitle||section.subtitle)&&!section.section_icon&&!section.sectionIconId&&!images.length&&!section.show_visa_info&&!section.show_best_time_to_visit&&!section.show_country_language);
}
export function createReadMoreSection(title='',url=''){
  return {section_id:null,read_more_only:true,section_subtitle:'',section_text:'',section_icon:null,section_url_title:title,section_url_link:url,show_visa_info:false,show_best_time_to_visit:false,show_country_language:false};
}
export function orderReadMoreSections(sections,images=[]){
  return sections.map((section,sourceIndex)=>({section,sourceIndex})).sort((a,b)=>Number(isReadMoreSection(a.section,images[a.sourceIndex]||[]))-Number(isReadMoreSection(b.section,images[b.sourceIndex]||[])));
}
export function readMoreIdentity(value){
  try{return new URL(value,'https://www.putujemstravem.com').pathname.replace(/\/$/,'');}catch{return value;}
}
/** @param {any[]} catalog @param {Record<string,any>} values @param {number|string|null} [excludeId] */
export function articleGuideSuggestions(catalog,values,excludeId=null){
  const sections=(values.sections||[]).filter(s=>!isReadMoreSection(s));
  const title=' '+normalize(values.article_title)+' ';
  const text=' '+normalize([values.article_title,values.article_description,...(values.metatags||[]).map(t=>t.metatag_text),...sections.flatMap(s=>[s.section_subtitle,String(s.section_text||'').slice(0,30000)])].join(' '))+' ';
  const chosen=new Map();
  for(const article of catalog){
    if(String(article.id)===String(excludeId)||!article.slug)continue;
    const prefixName=Object.keys(aliases).find(name=>normalize(article.slug).startsWith(normalize(name)+' '));
    const name=prefixName||article.place?.name||article.country?.name;if(!name)continue;
    const terms=[name,...(article.place?[article.place.name_genitive,article.place.name_dative,article.place.name_accusative,article.place.name_locative]:[]),...(aliases[name]||[])].filter(Boolean).map(normalize);
    if(values.read_more_origin_name&&terms.includes(normalize(values.read_more_origin_name)))continue;
    const matches=value=>terms.some(term=>term&&value.includes(' '+term+' '));
    if(!matches(text))continue;
    const guideTitle=normalize(article.title),quality=/\bvodic\b/.test(guideTitle)?50:/sto (vidjeti|posjetiti)|savjeti/.test(guideTitle)?20:0;
    if(!quality)continue;
    const labelName=(name===article.place?.name?article.place?.name_accusative:null)||accusative[name]||name;
    const item={id:article.id,title:article.title,label:`Naš vodič za ${labelName}`.slice(0,100),url:`https://www.putujemstravem.com/clanak/${encodeURIComponent(article.slug)}`,destination:name,score:quality+(matches(title)?100:0)};
    const key=normalize(name),previous=chosen.get(key);
    if(!previous||item.score>previous.score)chosen.set(key,item);
  }
  return [...chosen.values()].sort((a,b)=>b.score-a.score||a.destination.localeCompare(b.destination,'hr')).slice(0,12);
}
