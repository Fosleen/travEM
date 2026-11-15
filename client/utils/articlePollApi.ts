import {apiUrl} from './api';
export async function articlePollApi(path:string,body?:unknown,manage=false){
  const response=await fetch(`${apiUrl}/articles/${path}`,{cache:'no-store',headers:{...(body?{'Content-Type':'application/json'}:{}),...(manage?{Authorization:`Bearer ${localStorage.getItem('jwt')}`}:{})},...(body?{method:manage?'PATCH':'POST',body:JSON.stringify(body)}:{})});
  if(response.status===204)return null;
  const data=await response.json();if(!response.ok)throw new Error(data.error||'Anketa trenutačno nije dostupna.');return data;
}
