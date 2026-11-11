import {apiUrl} from './api';
export type DealJson = Record<string, any>;
export async function dealFinderApi(path:string,body?:unknown,method?:string) {
  const response=await fetch(`${apiUrl}/admin/deal-finder${path}`,{
    method:method||(body?'POST':'GET'),
    headers:{'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('jwt')}`},
    ...(body?{body:JSON.stringify(body)}:{}),
  });
  const data=await response.json();
  if(!response.ok)throw new Error(data.error||'Zahtjev nije uspio');
  return data;
}
