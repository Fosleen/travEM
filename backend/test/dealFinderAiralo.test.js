import test from 'node:test';
import assert from 'node:assert/strict';
import {airaloAffiliateLink} from '../app/services/dealFinder/airalo.js';
import {articleAffiliateOverrides} from '../app/services/dealFinder/articleAutomation.js';
import {defaults} from '../app/services/dealFinder/domain.js';

test('Airalo country links preserve every supplied Impact tracking field',()=>{
  for(const [country,slug] of Object.entries({CZ:'czech-republic',ES:'spain',PT:'portugal',MT:'malta',VN:'vietnam',US:'united-states'})){
    const link=airaloAffiliateLink(country),url=new URL(link.url);
    assert.equal(link.countrySpecific,true);
    assert.equal(url.origin,'https://airalocreatorprogram.sjv.io');
    assert.equal(url.pathname,'/c/6483817/3066282/37504');
    assert.equal(url.searchParams.get('u'),`https://www.airalo.com/${slug}-esim`);
    for(const [key,value] of Object.entries({partnerpropertyid:'7393873',ccid:'3285',postid:'3285-88192-42537',sowid:'88192',taskid:'42537'}))assert.equal(url.searchParams.get(key),value);
    assert.equal(url.searchParams.getAll('u').length,1);
  }
  for(const country of [undefined,'XX','AQ']){
    const link=airaloAffiliateLink(country);assert.equal(link.countrySpecific,false);assert.equal(new URL(link.url).searchParams.get('u'),'https://www.airalo.com');
  }
});
test('airport country determines Airalo landing page and global partner URLs stay unchanged',()=>{
  const partner={id:3,name:'Nabavi interneta',default_url:'https://airalo.pxf.io/PzYBez'},before=JSON.stringify(partner);
  for(const [destination,slug] of [['PRG','czech-republic'],['ACE','spain'],['PDL','portugal'],['CXR','vietnam']]){
    const [link]=articleAffiliateOverrides({destination,selection:{},data:{}},[partner],defaults);
    assert.equal(new URL(link.url).searchParams.get('u'),`https://www.airalo.com/${slug}-esim`);
  }
  assert.equal(JSON.stringify(partner),before);
});
