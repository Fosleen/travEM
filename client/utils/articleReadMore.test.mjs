import test from 'node:test';
import assert from 'node:assert/strict';
import {articleGuideSuggestions,createReadMoreSection,isReadMoreSection,orderReadMoreSections,readMoreIdentity} from './articleReadMore.mjs';
const catalog=[
  {id:1,title:'Cipar: vodič za istraživanje otoka',slug:'cipar-vodic-za-istrazivanje-otoka',country:{name:'Cipar'}},
  {id:2,title:'Rim: vječni vodič za vječni grad',slug:'rim-vjecni-vodic-za-vjecni-grad',country:{name:'Italija'}},
  {id:3,title:'Što vidjeti u Rimu',slug:'sto-vidjeti-u-rimu',place:{name:'Rim',name_locative:'Rimu',name_accusative:'Rim'}},
  {id:4,title:'Prag: najbolji vodič',slug:'prag-najbolji-vodic',place:{name:'Prag',name_locative:'Pragu',name_accusative:'Prag'}},
];
test('manual Cyprus and Rome articles suggest actual guide URLs with natural labels',()=>{
  const cyprus=articleGuideSuggestions(catalog,{article_title:'Jeftini letovi za Cipar'});
  assert.equal(cyprus.length,1);assert.equal(cyprus[0].label,'Naš vodič za Cipar');
  assert.equal(cyprus[0].url,'https://www.putujemstravem.com/clanak/cipar-vodic-za-istrazivanje-otoka');
  const rome=articleGuideSuggestions(catalog,{article_title:'Advent u Rimu: let i smještaj'});
  assert.equal(rome.length,1);assert.equal(rome[0].label,'Naš vodič za Rim');
  assert.equal(rome[0].url,'https://www.putujemstravem.com/clanak/rim-vjecni-vodic-za-vjecni-grad');
  assert.equal(articleGuideSuggestions(catalog,{article_title:'Letovi za Budimpeštu'}).length,0);
  assert.equal(articleGuideSuggestions([...catalog,{id:10,title:'Zagreb: vodič',slug:'zagreb-vodic',place:{name:'Zagreb',name_genitive:'Zagreba'}}],{article_title:'Jeftini letovi iz Zagreba za Cipar',read_more_origin_name:'Zagreb'}).length,1);
});
test('roundups detect several destinations in paragraphs and tags without using selected guide text as context',()=>{
  const values={article_title:'Jeftini povratni letovi iz Zagreba',metatags:[{metatag_text:'Prag'}],sections:[{section_subtitle:'Cipar (PFO)',section_text:'Povoljni letovi.'},{section_subtitle:'Rim (FCO)',section_text:'Termini.'},createReadMoreSection('Vodič za London','https://www.putujemstravem.com/clanak/london')]};
  assert.deepEqual(articleGuideSuggestions(catalog,values).map(g=>g.destination).sort(),['Cipar','Prag','Rim']);
  assert.ok(!articleGuideSuggestions(catalog,values,2).some(g=>g.id===2));
  assert.equal(readMoreIdentity('https://www.putujemstravem.com/clanak/rim/?x=1'),readMoreIdentity('/clanak/rim'));
});
test('link-only blocks stay standalone and save after body sections without changing image ownership',()=>{
  const link=createReadMoreSection('Naš vodič za Cipar','https://www.putujemstravem.com/clanak/cipar');
  assert.equal(isReadMoreSection(link),true);assert.equal(link.section_text,'');assert.equal(link.section_icon,null);
  assert.equal(isReadMoreSection({...link,read_more_only:undefined,section_text:'<p>Tekst odlomka.</p>'}),false);
  assert.equal(isReadMoreSection({...link,read_more_only:undefined},[{url:'photo.jpg'}]),false);
  const sections=[{section_text:'Uvod'},link,{section_text:'Letovi'}],images=[[{url:'intro.jpg'}],[],[{url:'flights.jpg'}]];
  const ordered=orderReadMoreSections(sections,images);
  assert.deepEqual(ordered.map(s=>s.sourceIndex),[0,2,1]);
  assert.equal(images[ordered[1].sourceIndex][0].url,'flights.jpg');assert.equal(sections[1],link);
});
