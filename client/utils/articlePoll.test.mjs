import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultArticlePoll,articlePollForSave,pollInsertIndex} from './articlePoll.mjs';
import {createReadMoreSection} from './articleReadMore.mjs';
test('all airfare CMS flows get three deterministic suggestions and manual choices stay untouched',()=>{
  const values={article_title:'Jeftini letovi za Rim',article_description:'Letovi za Prag i Maltu',metatags:[]};
  const poll=defaultArticlePoll(values);
  assert.equal(poll.options.length,3);assert.deepEqual(defaultArticlePoll(values),poll);
  assert.ok(!poll.options.some(o=>['Rim','Prag','Malta'].includes(o.label)));
  assert.equal(articlePollForSave(values),undefined);
  const manual={enabled:true,question:'Kamo sljedeće?',options:[{label:'Osaka',votes:10},{label:'Prag'}],autoOptions:false};
  assert.deepEqual(articlePollForSave({...values,destination_poll:manual}).options,[{label:'Osaka'},{label:'Prag'}]);
  assert.equal(articlePollForSave({...values,destination_poll:{...poll,autoOptions:true}}).options.length,3);
});
test('poll follows last content paragraph before trailing guide links and final affiliate/banner blocks',()=>{
  const link=createReadMoreSection('Naš vodič za Rim','https://www.putujemstravem.com/clanak/rim');
  assert.equal(pollInsertIndex([{text:'Uvod'},{text:'Posljednji odlomak'},link]),1);
  assert.equal(pollInsertIndex([link]),0);assert.equal(pollInsertIndex([]),-1);
});
