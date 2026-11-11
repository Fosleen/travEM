"use client";
import Image from 'next/image';
import {useState} from 'react';

export default function CountryFlag({country}:{country?:string}) {
  const code=country?.toUpperCase()||'';
  const [failed,setFailed]=useState('');
  if(!/^[A-Z]{2}$/.test(code))return null;
  if(failed===code)return <span title={code}>{code}</span>;
  return <Image src={`https://flagcdn.com/${code.toLowerCase()}.svg`} alt={`Zastava: ${code}`} title={code} width={20} height={15} unoptimized onError={()=>setFailed(code)} style={{display:'inline-block',verticalAlign:'middle',objectFit:'contain',flexShrink:0}}/>;
}
