/** Read a pasted search link locally. No redirect, network call, or claimed live price. */
export function parseManualFlightLink(value){
  let url;try{url=new URL(value);}catch{throw new Error('Unesi valjanu Skyscanner poveznicu.');}
  if(url.protocol!=='https:'||url.username||url.password||url.port||! /^(?:www\.)?skyscanner\.(?:net|com|[a-z]{2}|co\.uk|com\.au|co\.nz)$/i.test(url.hostname))throw new Error('Poveznica mora voditi na Skyscanner preko HTTPS-a.');
  /** @type {{sourceUrl:string,origin?:string,destination?:string,departureDate?:string,returnDate?:string,airlineCode?:string,outboundAirlineCode?:string,inboundAirlineCode?:string,priceEur?:number}} */
  const result={sourceUrl:url.href};
  const path=url.pathname.match(/^\/(?:prijevoz\/letovi|transport\/flights)\/([a-z]{3,4})\/([a-z]{3,4})\/(\d{6})\/(\d{6})\/?$/i);
  if(!path)return result;
  const date=value=>`20${value.slice(0,2)}-${value.slice(2,4)}-${value.slice(4,6)}`;
  result.origin=path[1].toUpperCase();result.destination=path[2].toUpperCase();
  result.departureDate=date(path[3]);result.returnDate=date(path[4]);
  const trace=url.searchParams.get('priceTrace')||'';
  const legs=[...trace.matchAll(/\*D\*([A-Z]{3})\*([A-Z]{3})\*(\d{8})\*[^*|]*\*([A-Z0-9]{2})(?=\||$)/g)];
  const out=legs.find(leg=>leg[1]===result.origin&&leg[3]===result.departureDate.replaceAll('-',''));
  const back=out&&legs.find(leg=>leg[1]===out[2]&&leg[2]===out[1]&&leg[3]===result.returnDate.replaceAll('-',''));
  if(out&&back){result.destination=out[2];result.outboundAirlineCode=out[4];result.inboundAirlineCode=back[4];if(out[4]===back[4])result.airlineCode=out[4];}
  const price=Number(url.searchParams.get('qp_prevPrice'));
  if(url.searchParams.get('qp_prevCurrency')==='EUR'&&Number.isFinite(price)&&price>0)result.priceEur=price;
  return result;
}
