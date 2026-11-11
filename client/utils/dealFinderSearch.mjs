export function nextSearchDate(value) {
  const result=new Date(value+'T12:00:00Z');result.setUTCDate(result.getUTCDate()+1);return result.toISOString().slice(0,10);
}
export function defaultSearchWindow(now=new Date()) {
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Zagreb',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(p=>[p.type,p.value]));
  const start=`${parts.year}-${parts.month}-${parts.day}`;
  return {start,end:nextSearchDate(start)};
}
export function changeSearchStart(search,value) {
  if(!value)return {...search,start:''};
  const wasDefault=search.start&&search.end===nextSearchDate(search.start);
  return {...search,start:value,end:wasDefault||!search.end||search.end<=value?nextSearchDate(value):search.end};
}
export function searchWindowDays(start,end){return (Date.parse(end+'T12:00:00Z')-Date.parse(start+'T12:00:00Z'))/86400000;}
