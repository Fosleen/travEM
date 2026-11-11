const prefix='travem:deal-article-form:';
export function storeDealArticlePrefill(storage,payload,token){
 if(!/^[a-zA-Z0-9-]+$/.test(token))throw new Error('Neispravan prijenos članka');
 storage.setItem(prefix+token,JSON.stringify({...payload,createdAt:Date.now()}));return token;
}
export function readDealArticlePrefill(storage,token){
 if(!token||!/^[a-zA-Z0-9-]+$/.test(token))return null;
 try{const raw=storage.getItem(prefix+token);if(!raw||raw.length>2000000)return null;const payload=JSON.parse(raw);
  if(payload.version!==1||!Number.isInteger(payload.offerId)||!payload.values||!Array.isArray(payload.values.sections)||!payload.values.sections.length||payload.values.sections.length>100||Date.now()-payload.createdAt>86400000)return null;
  if(['article_title','article_subtitle','article_description'].some(key=>typeof payload.values[key]!=='string'))return null;
  return payload;
 }catch{return null;}
}
export function clearDealArticlePrefill(storage,token){if(token&&/^[a-zA-Z0-9-]+$/.test(token))storage.removeItem(prefix+token);}
