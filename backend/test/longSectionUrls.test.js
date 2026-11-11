import test from 'node:test';
import assert from 'node:assert/strict';
import {Sequelize,DataTypes} from 'sequelize';
import sectionModel from '../app/models/section.js';
import sectionImageModel from '../app/models/sectionImage.js';
import {longSectionUrlsPlan} from '../scripts/longSectionUrlsPlan.js';

const rows=[['section','link_url','YES'],['section_image','url','NO']].map(([TABLE_NAME,COLUMN_NAME,IS_NULLABLE])=>({TABLE_NAME,COLUMN_NAME,IS_NULLABLE,DATA_TYPE:'varchar',CHARACTER_MAXIMUM_LENGTH:255,CHARACTER_OCTET_LENGTH:1020,CHARACTER_SET_NAME:'utf8mb4',COLLATION_NAME:'utf8mb4_unicode_ci',COLUMN_DEFAULT:null,COLUMN_COMMENT:'',EXTRA:'',ENGINE:'InnoDB'}));
test('long URL migration only widens existing columns online and preserves nullability and collation',()=>{
 const plan=longSectionUrlsPlan(rows);assert.equal(plan.length,2);
 for(const step of plan){assert.match(step.sql,/VARCHAR\(512\) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci/);assert.match(step.sql,/ALGORITHM=INPLACE, LOCK=NONE$/);assert.doesNotMatch(step.sql,/DROP|DELETE|TRUNCATE|COPY/);}
 assert.match(plan[0].sql,/ NULL DEFAULT NULL/);assert.match(plan[1].sql,/ NOT NULL/);
 const customized=longSectionUrlsPlan(rows.map(row=>({...row,COLUMN_DEFAULT:'https://example.com',COLUMN_COMMENT:'Booking link'})));
 assert.match(customized[0].sql,/DEFAULT 'https:\/\/example.com' COMMENT 'Booking link'/);
 assert.deepEqual(longSectionUrlsPlan(rows.map(row=>({...row,CHARACTER_MAXIMUM_LENGTH:512}))),[]);
 assert.throws(()=>longSectionUrlsPlan(rows.map(row=>({...row,CHARACTER_OCTET_LENGTH:255}))),/granice|granicu/);
 assert.throws(()=>longSectionUrlsPlan(rows.map(row=>({...row,ENGINE:'MyISAM'}))),/InnoDB/);
});
test('long Booking links and section image URLs survive creation and editing without truncation',async()=>{
 const database=new Sequelize({dialect:'sqlite',storage:':memory:',logging:false}),Section=sectionModel(database,DataTypes),Image=sectionImageModel(database,DataTypes);
 try{
  await database.sync({force:true});const url='https://www.booking.com/hotel/es/test.html?aid=123&label='+'x'.repeat(400),photo='https://cf.bstatic.com/xdata/images/hotel/123.jpg?k='+'a'.repeat(400);
  const section=await Section.create({text:'Tekst',order:1,link_url:url});const image=await Image.create({url:photo});
  assert.equal((await Section.findByPk(section.id)).link_url,url);assert.equal((await Image.findByPk(image.id)).url,photo);
  await section.update({link_url:url+'&checkin=2026-12-01'});assert.ok(section.link_url.endsWith('2026-12-01'));
  await assert.rejects(()=>section.update({link_url:'x'.repeat(513)}));
 }finally{await database.close();}
});
