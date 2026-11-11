"use client";
import {useEffect,useState} from 'react';
import {Bell,ArrowSquareOut} from '@phosphor-icons/react';
const key='travem:deal-finder:pexels-reminder';
const delay=3*86400000;
export default function DealPexelsReminder(){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const check=()=>{
      try{
        const stored=localStorage.getItem(key);
        if(stored==='done'){setVisible(false);return;}
        if(!stored||!Number.isFinite(Number(stored))){localStorage.setItem(key,String(Date.now()+delay));return;}
        setVisible(Date.now()>=Number(stored));
      }catch{/* A reminder is optional when browser storage is unavailable. */}
    };
    const initial=setTimeout(check,0),timer=setInterval(check,60000);
    return()=>{clearTimeout(initial);clearInterval(timer);};
  },[]);
  if(!visible)return null;
  const dismiss=(value:string)=>{try{localStorage.setItem(key,value);}catch{}setVisible(false);};
  return <aside className="df-pexels-reminder" role="status"><Bell size={24}/><div><strong>Provjeri prima li Pexels nove zahtjeve za API ključ</strong><p>Automatske fotografije su na čekanju dok ne dobiješ ključ.</p><a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer">Otvori Pexels <ArrowSquareOut size={15}/></a></div><div className="df-reminder-actions"><button type="button" onClick={()=>dismiss(String(Date.now()+delay))}>Podsjeti za 3 dana</button><button type="button" onClick={()=>dismiss('done')}>Makni podsjetnik</button></div></aside>;
}
