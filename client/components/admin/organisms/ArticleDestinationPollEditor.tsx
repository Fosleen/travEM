"use client";
import {useEffect,useState} from 'react';
import {ErrorMessage,useFormikContext} from 'formik';
import {Plus,Trash,ArrowsClockwise} from '@phosphor-icons/react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ToggleSwitch from '@/components/admin/atoms/ToggleSwitch';
import {articlePollApi} from '@/utils/articlePollApi';
import {defaultArticlePoll} from '@/utils/articlePoll.mjs';
import './ArticleDestinationPollEditor.scss';
type Json=Record<string,any>;
export default function ArticleDestinationPollEditor({articleId}:{articleId?:number}){
  const {values,setFieldValue,isSubmitting}=useFormikContext<Json>();
  const [message,setMessage]=useState('Učitavam postavke ankete…');
  const isFlights=Number(values.article_type)===2,draft=values.destination_poll;
  const view=draft?.autoOptions?{...draft,...defaultArticlePoll(values),enabled:draft.enabled,question:draft.question}:draft||defaultArticlePoll(values);
  useEffect(()=>{
    if(!isFlights||draft)return;let cancelled=false;
    const load=async()=>{
      const capabilities=await articlePollApi('poll-capabilities',undefined,true);
      if(!capabilities.available){if(!cancelled)setMessage('Anketa će biti dostupna nakon primjene SQL migracije article-destination-polls.sql. Spremanje članka ostaje dostupno.');return;}
      const config=articleId?await articlePollApi(`${articleId}/destination-poll/manage`,undefined,true):{...defaultArticlePoll(),autoOptions:true};
      if(!cancelled){await setFieldValue('destination_poll',config,false);setMessage('');}
    };
    load().catch(error=>{if(!cancelled)setMessage(error.message);});return()=>{cancelled=true;};
  },[isFlights,draft,articleId,setFieldValue]);
  if(!isFlights)return null;
  const update=(patch:Json)=>void setFieldValue('destination_poll',{...draft,...view,...patch});
  return <section className="article-poll-editor" aria-label="Anketa o sljedećoj destinaciji"><h3>Anketa: kamo sljedeće?</h3><p>Prikazuje se nakon posljednjeg odlomka, prije završnih bannera i affiliate poveznica. Čitatelji glasaju jednim klikom, a zatim vide postotke.</p>
    {message&&<p role="status">{message}</p>}<ErrorMessage name="destination_poll" component="p" className="error-message"/>
    {draft&&<><ToggleSwitch name="article-destination-poll-enabled" description="Prikaži anketu na članku" value={view.enabled} setter={(enabled:boolean)=>update({enabled})}/>
    {view.enabled&&<><Input label="Pitanje ankete" placeholder="Za koju destinaciju želiš sljedeću ponudu?" name="destination_poll.question" value={view.question} maxLength={120} disabled={isSubmitting} onChange={e=>update({question:e.target.value})}/>
    <div className="article-poll-editor-options">{view.options.map((option:Json,index:number)=><div key={index}><Input label={`Opcija ${index+1}`} placeholder="Naziv destinacije" name={`destination_poll.options.${index}.label`} value={option.label} maxLength={60} disabled={isSubmitting||Boolean(option.votes)} onChange={e=>update({autoOptions:false,options:view.options.map((old:Json,i:number)=>i===index?{...old,label:e.target.value}:old)})}/>{option.votes>0&&<small>{option.votes} glasova</small>}<Button type="button" white disabled={isSubmitting||view.options.length<=2||Boolean(option.votes)} onClick={()=>update({autoOptions:false,options:view.options.filter((_:Json,i:number)=>i!==index)})}><Trash size={18}/>Ukloni</Button></div>)}</div>
    <div className="article-poll-editor-actions"><Button type="button" white disabled={isSubmitting||view.options.length>=10} onClick={()=>update({autoOptions:false,options:[...view.options,{label:''}]})}><Plus size={18}/>Dodaj opciju</Button><Button type="button" white disabled={isSubmitting||view.options.some((option:Json)=>option.votes>0)} onClick={()=>update({autoOptions:true,options:defaultArticlePoll(values).options})}><ArrowsClockwise size={18}/>Predloži tri opcije</Button></div>
    <small>Čitatelji mogu predložiti drugo odredište dok anketa ne dosegne deset opcija. Prijedlog ujedno računa njihov glas. Opcije s glasovima ostaju zaključane kako se rezultati ne bi promijenili.</small></>}
    </>}
  </section>;
}
