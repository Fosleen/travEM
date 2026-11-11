// Full Impact tracking URL supplied by the publisher. Only the landing URL changes.
const trackingUrl='https://airalocreatorprogram.sjv.io/c/6483817/3066282/37504?u=https%3A%2F%2Fwww.airalo.com&partnerpropertyid=7393873&ccid=3285&postid=3285-88192-42537&sowid=88192&taskid=42537';
// Official Airalo landing pages checked on 2026-11-11. Unknown countries use the homepage.
const destinations={CZ:'czech-republic',ES:'spain',PT:'portugal',IT:'italy',MT:'malta',GR:'greece',CY:'cyprus',DE:'germany',FR:'france',NL:'netherlands',BE:'belgium',CA:'canada',US:'united-states',GB:'united-kingdom',MA:'morocco',VN:'vietnam'};
export function airaloAffiliateLink(country){
  const slug=destinations[country],url=new URL(trackingUrl);
  url.searchParams.set('u',slug?`https://www.airalo.com/${slug}-esim`:'https://www.airalo.com');
  return {url:url.href,countrySpecific:Boolean(slug)};
}
