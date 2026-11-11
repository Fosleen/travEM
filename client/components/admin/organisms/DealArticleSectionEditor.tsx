"use client";
import {useState} from 'react';
import Image from 'next/image';
import AdvancedEditor from '@/components/atoms/AdvancedEditor';
import AdvancedDropdown from '@/components/admin/atoms/AdvancedDropdown';
import type {DealJson} from '@/utils/dealFinder';

type Props={section:DealJson,icons:DealJson[],onChange:(section:DealJson)=>void};
export default function DealArticleSectionEditor({section,icons,onChange}:Props){
 const [panelHost,setPanelHost]=useState<HTMLDivElement|null>(null);
 const [copiedUrl,setCopiedUrl]=useState(''),[copyFailed,setCopyFailed]=useState(false);
 const intro=section.kind==='intro';
 return <div className="df-editorial-section">
  <strong>{intro?'Uvod':section.subtitle||'Odlomak članka'}</strong>
  {!intro&&<div className="df-section-top">
   <label>Podnaslov odlomka (opcionalno)<input maxLength={100} value={section.subtitle} onChange={e=>onChange({...section,subtitle:e.target.value})}/></label>
   <div className="df-section-icon-picker">
    {panelHost&&<AdvancedDropdown label="Vrsta ikone" options={icons} selectedValue={section.sectionIconId} images appendTo={panelHost} onChange={(icon:DealJson|null)=>onChange({...section,sectionIconId:icon?.id??null})}/>}
    <div className="df-section-icon-options" ref={setPanelHost}/>
   </div>
  </div>}
  <AdvancedEditor label={intro?'Tekst uvoda':'Tekst odlomka'} name={`deal-section-${section.kind}`} value={section.text} onChange={(event:{target:{value:string}})=>onChange({...section,text:event.target.value,format:'html'})}/>
  {!intro&&<div className="df-section-links">
   <label>Naslov poveznice (opcionalno)<input maxLength={100} value={section.link_title||''} onChange={e=>onChange({...section,link_title:e.target.value})}/></label>
   <label>Poveznica (opcionalno)<input type="url" value={section.link_url||''} placeholder="https://..." onChange={e=>onChange({...section,link_url:e.target.value})}/></label>
  </div>}
  {section.images?.length>0&&<div className="df-section-photos"><strong>Fotografije smještaja</strong><div className="df-section-photo-grid">{section.images.map((photo:DealJson,index:number)=><div key={photo.url} className="df-section-photo">
    <Image src={photo.url} alt={`Fotografija smještaja ${index+1}`} width={160} height={110} unoptimized/>
    <label className="df-photo-toggle"><input type="checkbox" checked={photo.include!==false} onChange={e=>onChange({...section,images:section.images.map((image:DealJson,i:number)=>i===index?{...image,include:e.target.checked}:image)})}/>Uključi u članak</label>
    <input type="text" readOnly value={photo.url} aria-label={`URL fotografije ${index+1}`} onFocus={e=>e.target.select()}/>
    <button type="button" className="df-text-button" onClick={async()=>{try{await navigator.clipboard.writeText(photo.url);setCopiedUrl(photo.url);setCopyFailed(false);}catch{setCopyFailed(true);}}}>{copiedUrl===photo.url?'URL kopiran':'Kopiraj URL slike'}</button>
    <a href={photo.url} target="_blank" rel="noopener noreferrer">Otvori fotografiju ↗</a>
  </div>)}</div>{copyFailed&&<small role="status">Klikni polje s URL-om i kopiraj ga pomoću Ctrl+C.</small>}</div>}
 </div>;
}
