"use client";
import {useState} from 'react';

type Props={label:string,value:string,options:string[],maxLength:number,onChange:(value:string)=>void,multiline?:boolean};
export default function DealEditorialChoice({label,value,options,maxLength,onChange,multiline=false}:Props){
 const [custom,setCustom]=useState(false);
 const choices=[...new Set(options)].map((name,index)=>({id:String(index),name}));
 choices.push({id:'custom',name:'Vlastito'});
 const selected=custom?'custom':choices.find(option=>option.id!=='custom'&&option.name===value)?.id||'custom';
 return <div className="df-editorial-choice">
  <label>{label}<select value={selected} onChange={e=>{
   const option=choices.find(choice=>choice.id===e.target.value);
   if(!option||option.id==='custom'){setCustom(true);return;}setCustom(false);onChange(option.name);
  }}>{choices.map(option=><option key={option.id} value={option.id}>{option.name}</option>)}</select></label>
  <label>{selected==='custom'?'Vlastiti tekst':'Uredi odabrani tekst'}{multiline?<textarea rows={3} value={value} maxLength={maxLength} onChange={e=>onChange(e.target.value)}/>:<input value={value} maxLength={maxLength} onChange={e=>onChange(e.target.value)}/>}</label>
  <small>{value.length}/{maxLength} znakova</small>
 </div>;
}
