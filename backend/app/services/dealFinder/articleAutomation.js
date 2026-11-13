import {Op} from 'sequelize';
import {airportByCode} from './airports.js';
import {skyscanner,hotelBookingLink} from './domain.js';
import {flightForStay} from './editorialFacts.js';
import {airaloAffiliateLink} from './airalo.js';

const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const httpsUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&u.href.length<=2048?u:null;}catch{return null;}};
export function youtubeEmbedUrl(value){
  const u=httpsUrl(value);if(!u)return '';
  let id;
  if(['youtube.com','www.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(u.hostname))id=u.pathname==='/watch'?u.searchParams.get('v'):/^\/(?:embed|shorts)\/([^/]+)\/?$/.exec(u.pathname)?.[1];
  else if(u.hostname==='youtu.be')id=u.pathname.slice(1);
  return /^[A-Za-z0-9_-]{11}$/.test(id||'')?`https://www.youtube.com/embed/${id}`:'';
}
const host=value=>httpsUrl(value)?.hostname||'';
function partnerKind(partner){
  const h=host(partner.default_url);
  if(['www.discovercars.com','discovercars.com'].includes(h))return 'cars';
  if(h==='hostelworld.prf.hn'||h==='hostelworld.com'||h==='www.hostelworld.com')return 'hostel';
  if(h==='skyscanner.pxf.io'||/(^|\.)skyscanner\.(net|com)$/.test(h))return 'flights';
  if(['airalo.pxf.io','airalocreatorprogram.sjv.io','airalo.com','www.airalo.com'].includes(h))return 'internet';
  if(h==='go.bounce.com')return 'luggage';
  if(['www.anrdoezrs.net','www.dpbolvw.net','www.jdoqocy.com'].includes(h)&&/booking|smještaj|smjestaj/i.test(`${partner.name} ${partner.label||''}`)||h==='www.booking.com'||h==='booking.com')return 'hotel';
  return null;
}
// These landing pages are confirmed editorial inputs, never guessed city slugs.
const carDestinations={PRG:'/czech-republic/prague'};
export function articleAffiliateOverrides(offer,partners,settings,previousLinks=[]){
  if(['monthly','roundup'].includes(offer.selection?.template))return [];
  const selection=offer.selection||{},hotel=selection.flightsOnly?null:offer.data?.hotels?.[selection.hotelIndex];
  const flights=(selection.flightIndices||[]).map(i=>offer.data?.flights?.[i]).filter(Boolean);
  const flight=flightForStay(offer,hotel)?.flight||flights[selection.exampleIndex||0]||flights[0];
  const result=[];
  for(const partner of partners){
    const kind=partnerKind(partner);let url='',source='';
    if(kind==='flights'&&flight){url=skyscanner(flight,settings);source='Odabrani povratni let i datumi';}
    if(kind==='hotel'&&hotel){url=hotelBookingLink(hotel,settings);source='Glavni smještaj i datumi boravka';}
    if(kind==='hostel'&&!selection.flightsOnly&&selection.hostel?.url){url=selection.hostel.url;source='Odabrana hostelska opcija';}
    if(kind==='internet'){
      const link=airaloAffiliateLink(airportByCode(offer.destination)?.country);
      url=link.url;source=link.countrySpecific?'eSIM za državu odredišta':'Airalo početna stranica; odredišna država nije potvrđena';
    }
    if(kind==='cars'){
      const previous=previousLinks.find(link=>Number(link.affiliatePartnerId)===Number(partner.id)&&httpsUrl(link.url)&&host(link.url)===host(partner.default_url)&&link.url!==partner.default_url);
      if(previous){url=previous.url;source='Postojeći članak za istu destinaciju';}
      if(!url&&kind==='cars'&&carDestinations[offer.destination]){
        const base=httpsUrl(partner.default_url),destination=new URL(carDestinations[offer.destination],base.origin);
        destination.search=base.search;url=destination.href;source='Potvrđena odredišna stranica';
      }
    }
    if(url&&httpsUrl(url)&&url!==partner.default_url)result.push({affiliatePartnerId:partner.id,url,is_enabled:true,partnerName:partner.name,source});
  }
  return result;
}

export async function articleAutomation(offer,settings,models){
  const automation={video:null,affiliateUpdates:[],warnings:[]};
  const result={affiliateLinks:[],automation};
  if(['monthly','roundup'].includes(offer.selection?.template))return result;
  const airport=airportByCode(offer.destination);
  const names=new Set([airport?.city,...(airport?.aliases||[])].filter(Boolean).map(normalize));
  // Use only the catalog's destination names, not model-generated free text.
  const lookups=await Promise.allSettled([
    models.AffiliatePartner.findAll({order:[['sort_order','ASC'],['id','ASC']],raw:true}),
    models.Place.findAll({attributes:['id','name','countryId'],raw:true}),
  ]);
  const partners=lookups[0].status==='fulfilled'?lookups[0].value:[];
  if(lookups[0].status==='rejected')automation.warnings.push('Affiliate partneri nisu dostupni; u CMS-u provjeri poveznice.');
  let places=lookups[1].status==='fulfilled'?lookups[1].value.filter(p=>names.has(normalize(p.name))):[];
  if(lookups[1].status==='rejected')automation.warnings.push('Postojeći video nije bilo moguće provjeriti.');
  if(places.length>1&&airport?.country){
    const countryNames=new Set(['hr','en'].map(locale=>normalize(new Intl.DisplayNames([locale],{type:'region'}).of(airport.country))));
    try{
      const countries=await models.Country.findAll({attributes:['id','name'],raw:true});
      const ids=countries.filter(c=>countryNames.has(normalize(c.name))).map(c=>c.id);
      places=places.filter(p=>ids.includes(p.countryId));
    }catch{places=[];}
  }
  let previousLinks=[];
  if(places.length===1){
    try{
      const articles=await models.Article.findAll({attributes:['id','title'],where:{placeId:places[0].id,is_deal_draft:false,[Op.or]:[{'$article_schedule.id$':null},{'$article_schedule.publish_at$':null},{'$article_schedule.publish_at$':{[Op.lte]:new Date()}}]},include:[{model:models.ArticleSchedule,attributes:[],required:false}],order:[['id','DESC']],raw:true});
      const articleIds=articles.map(a=>a.id);
      const videos=await models.Video.findAll({attributes:['id','url','articleId','placeId'],where:{[Op.or]:[{placeId:places[0].id},...(articleIds.length?[{articleId:{[Op.in]:articleIds}}]:[])]},order:[['id','DESC']],raw:true});
      const video=videos.find(v=>(v.articleId==null||articleIds.includes(v.articleId))&&youtubeEmbedUrl(v.url));
      if(video)automation.video={url:youtubeEmbedUrl(video.url),sourceTitle:articles.find(a=>a.id===video.articleId)?.title||places[0].name};
      if(articleIds.length)previousLinks=await models.ArticleAffiliateLink.findAll({attributes:['affiliatePartnerId','url','articleId'],where:{articleId:{[Op.in]:articleIds},is_enabled:true,url:{[Op.ne]:null}},order:[['articleId','DESC'],['id','DESC']],raw:true});
    }catch{automation.warnings.push('Dio postojećih videa ili destinacijskih poveznica nije dostupan; provjeri ih u CMS-u.');}
  }
  result.affiliateLinks=articleAffiliateOverrides(offer,partners,settings,previousLinks);
  automation.affiliateUpdates=result.affiliateLinks.map(({partnerName,source})=>({partnerName,source}));
  return result;
}
