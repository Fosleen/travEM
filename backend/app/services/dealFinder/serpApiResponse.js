// Persist only a short, redacted error and public search ID, never response bodies or request URLs.
export function safeSerpApiError(value,apiKey='') {
  let message=typeof value==='string'?value:'Nepoznata pogreška odgovora';
  if(apiKey)message=message.split(apiKey).join('[skriveno]');
  return message.replace(/https?:\/\/\S+/gi,'[URL uklonjen]').replace(/\b(api[_-]?key|token|authorization|password)\s*[:=]\s*[^\s,;]+/gi,'$1=[skriveno]').replace(/[\r\n\t]+/g,' ').slice(0,350);
}
export async function readSerpApiResponse(response,{engine,params,apiKey}) {
  const route=[params.departure_id,params.arrival_id].filter(Boolean).join(' → ');
  const context=`${engine}${route?` · ${route}`:''}`;
  let data;try{data=await response.json();}catch{throw new Error(`SerpApi HTTP ${response.status} · ${context}: odgovor nije valjan JSON`);}
  const id=typeof data?.search_metadata?.id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(data.search_metadata.id)?` · pretraga ${data.search_metadata.id}`:'';
  // Empty calendars can use HTTP 200 with metadata.status "Error" as well as "Success".
  // Match only the known no-results message for this engine; account/parameter errors stay fatal.
  const emptyMessages={google_flights_calendar:/^Google(?: Flights Calendar)? (?:hasn't returned any results|returned no results) for this query\.?$/i,google_flights_deals:/^Google(?: Flights Deals)? (?:hasn't returned any results|returned no results) for this query\.?$/i};
  if(response.ok&&response.status===200&&emptyMessages[engine]?.test(typeof data?.error==='string'?data.error.trim():'')){
    return {...data,error:undefined,emptyResult:true};
  }
  if(!response.ok||data?.error)throw new Error(`SerpApi HTTP ${response.status} · ${context}${id}: ${safeSerpApiError(data?.error||'Upit nije prihvaćen',apiKey)}`);
  if(!data||typeof data!=='object'||Array.isArray(data))throw new Error(`SerpApi · ${context}: neispravan odgovor`);
  return data;
}
