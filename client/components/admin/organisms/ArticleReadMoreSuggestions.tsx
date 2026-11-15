"use client";
import {useEffect,useMemo,useState} from 'react';
import {Field,ErrorMessage,useFormikContext} from 'formik';
import {Plus,Trash} from '@phosphor-icons/react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ArticleReadMore from '@/components/user/atoms/ArticleReadMore';
import {apiUrl} from '@/utils/api';
import {ARTICLE_TYPE_AIRPLANE_TICKET_ID} from '@/utils/articleTypeHelpers';
import {articleGuideSuggestions,createReadMoreSection,isReadMoreSection,readMoreIdentity} from '@/utils/articleReadMore.mjs';
import './ArticleReadMoreSuggestions.scss';

type Json=Record<string,any>;
type Props={sectionImages:Json[][],setSectionImages:(updater:(previous:Json[][])=>Json[][])=>void,articleId?:number,airportCities?:Json[]|string};
let catalogPromise:Promise<Json[]>|null=null,catalogExpires=0;
function loadGuides(){
  if(!catalogPromise||Date.now()>catalogExpires){
    catalogExpires=Date.now()+300000;
    catalogPromise=fetch(`${apiUrl}/articles/read-more-guides`,{headers:{Authorization:`Bearer ${localStorage.getItem('jwt')}`}}).then(async response=>{if(!response.ok)throw new Error('Prijedlozi vodiča trenutačno nisu dostupni.');const data=await response.json();if(!Array.isArray(data))throw new Error('Popis vodiča nije dostupan.');return data;}).catch(error=>{catalogPromise=null;throw error;});
  }
  return catalogPromise;
}
export default function ArticleReadMoreSuggestions({sectionImages,setSectionImages,articleId,airportCities=[]}:Props){
  const {values,setFieldValue,isSubmitting}=useFormikContext<Json>();
  const [catalog,setCatalog]=useState<Json[]>([]),[error,setError]=useState(''),[loading,setLoading]=useState(true);
  const isFlights=String(values.article_type)===ARTICLE_TYPE_AIRPLANE_TICKET_ID;
  const sections:Json[]=values.sections||[];
  const links=sections.map((section,index)=>({section,index})).filter(({section,index})=>isReadMoreSection(section,sectionImages[index]||[]));
  const originName=Array.isArray(airportCities)?airportCities.find(city=>String(city.id)===String(values.article_airport_city_id))?.name:undefined;
  const suggestions=useMemo(()=>articleGuideSuggestions(catalog,{...values,read_more_origin_name:originName},articleId),[catalog,values,articleId,originName]);
  const existing=new Set(sections.map(section=>readMoreIdentity(section.section_url_link||'')));
  useEffect(()=>{
    if(!isFlights)return;let cancelled=false;
    loadGuides().then(data=>{if(!cancelled){setCatalog(data);setError('');}}).catch(e=>{if(!cancelled)setError(e.message);}).finally(()=>{if(!cancelled)setLoading(false);});
    return()=>{cancelled=true;};
  },[isFlights]);
  if(!isFlights&&!links.length)return null;
  function add(title='',url=''){
    void setFieldValue('sections',[...sections,createReadMoreSection(title,url)]);
    setSectionImages(previous=>[...sections.map((_,index)=>previous[index]||[]),[]]);
  }
  function remove(index:number){
    void setFieldValue('sections',sections.filter((_,i)=>i!==index));
    setSectionImages(previous=>sections.map((_,i)=>previous[i]||[]).filter((_,i)=>i!==index));
  }
  return <section className="article-related-links" aria-label="Povezani vodiči na kraju članka">
    <h3>Povezani vodiči na kraju članka</h3><p>Dodaj samostalne poveznice „Pročitaj više”, bez dodatnog odlomka. Prijedlozi prate odredišta iz naslova, oznaka i teksta.</p>
    {isFlights&&<div className="article-related-suggestions" aria-live="polite">{loading&&<p>Učitavam objavljene vodiče…</p>}{error&&<p role="status">{error} Poveznicu možeš dodati ručno.</p>}{!loading&&!error&&!suggestions.length&&<p>Za trenutačno upisana odredišta nema pronađenih vodiča.</p>}{suggestions.map(guide=><div key={guide.id}><div><strong>{guide.label}</strong><a href={guide.url} target="_blank" rel="noopener noreferrer">{guide.title}</a></div><Button type="button" white disabled={isSubmitting||existing.has(readMoreIdentity(guide.url))} onClick={()=>add(guide.label,guide.url)}><Plus size={17}/>{existing.has(readMoreIdentity(guide.url))?'Dodano':'Dodaj poveznicu'}</Button></div>)}</div>}
    {links.map(({section,index})=><div className="article-related-link" key={section.form_key||section.section_id||index}>
      <div className="edit-article-section-bottom"><div><Field name={`sections.${index}.section_url_title`} as={Input} label="Tekst poveznice" maxLength={100}/><ErrorMessage name={`sections.${index}.section_url_title`} component="div" className="error-message"/></div><div><Field name={`sections.${index}.section_url_link`} as={Input} label="Poveznica na članak" maxLength={512}/><ErrorMessage name={`sections.${index}.section_url_link`} component="div" className="error-message"/></div><Button type="button" white disabled={isSubmitting} onClick={()=>remove(index)}><Trash size={18}/>Ukloni</Button></div>
      {section.section_url_title&&/^https?:\/\//i.test(section.section_url_link||'')&&<ArticleReadMore section={{link_title:section.section_url_title,link_url:section.section_url_link}}/>}
    </div>)}
    <Button type="button" white disabled={isSubmitting} onClick={()=>add()}><Plus size={18}/>Dodaj vlastitu poveznicu</Button>
  </section>;
}
