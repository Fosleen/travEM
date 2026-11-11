"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {apiUrl} from '@/utils/api';
export default function DealDraftActions({articleId}:{articleId:number}) {
  const [offerId,setOfferId]=useState<number|null>(null),[message,setMessage]=useState('');
  useEffect(()=>{fetch(`${apiUrl}/admin/deal-finder/offers`,{headers:{Authorization:`Bearer ${localStorage.getItem('jwt')}`}}).then(r=>r.ok?r.json():[]).then(rows=>setOfferId(rows.find((o:{articleId:number,status:string})=>o.articleId===Number(articleId)&&o.status==='draft')?.id||null)).catch(()=>{});},[articleId]);
  if(!offerId)return null;
  return <aside role="note" style={{padding:16,border:'2px solid #35807d',marginBottom:20}}><strong>Deal Finder nacrt: skriven javnosti</strong><p>Spremanje izmjena zadržava nacrt. Nakon spremanja i završne provjere sadržaja možete izričito odobriti objavu. Slanje newslettera zahtijeva zasebnu radnju.</p><Link href="/admin/deal-finder">Provjeri cijene i izbor u Deal Finderu</Link><p><button type="button" onClick={async()=>{
    if(!window.confirm('Potvrđujem da su izmjene spremljene, sadržaj pregledan i cijene ponovno provjerene. Odobravam javnu objavu ovog članka.'))return;
    try {const r=await fetch(`${apiUrl}/admin/deal-finder/offers/${offerId}/approve`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('jwt')}`},body:JSON.stringify({confirm:true})});const d=await r.json();if(!r.ok)throw new Error(d.error);setMessage('Objava je odobrena.');setOfferId(null);}catch(e){setMessage(e instanceof Error?e.message:'Pogreška');}
  }}>Odobri javnu objavu pregledanog nacrta</button></p>{message&&<p role="status">{message}</p>}</aside>;
}
