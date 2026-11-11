import test from 'node:test';
import assert from 'node:assert/strict';
import {Sequelize,DataTypes,Op} from 'sequelize';
import {orderedRows} from '../app/services/dealFinder/orderedRows.js';

test('offer priority and limit survive while JSON payloads never enter the ordered SELECT',async()=>{
  const database=new Sequelize({dialect:'sqlite',storage:':memory:',logging:false});
  const Offer=database.define('offers',{status:DataTypes.STRING,updatedAt:DataTypes.DATE,data:DataTypes.JSON},{timestamps:false});
  try{
    await database.sync({force:true});
    const payload={flightCandidates:Array.from({length:1000},(_,i)=>({id:i,details:'x'.repeat(500)}))};
    await Offer.bulkCreate([{status:'rejected',updatedAt:new Date('2026-12-10'),data:payload},{status:'verified',updatedAt:new Date('2026-12-09'),data:payload},{status:'needs_verification',updatedAt:new Date('2026-12-08'),data:payload}]);
    const sql=[];database.options.logging=query=>sql.push(query);
    const priority=database.literal("CASE WHEN status = 'needs_verification' THEN 0 WHEN status = 'rejected' THEN 2 ELSE 1 END");
    const rows=await orderedRows(Offer,{order:[[priority,'ASC'],['updatedAt','DESC'],['id','DESC']],limit:2});
    assert.deepEqual(rows.map(row=>row.status),['needs_verification','verified']);
    assert.equal(rows[0].data.flightCandidates.length,1000);
    assert.equal(sql.length,2);assert.match(sql[0],/SELECT `id` FROM/);assert.match(sql[0],/ORDER BY/);assert.match(sql[0],/LIMIT 2/);
    assert.doesNotMatch(sql[0],/SELECT[^;]*`data`/);assert.doesNotMatch(sql[1],/ORDER BY/);
  }finally{await database.close();}
});
test('empty result avoids payload reads and concurrent deletion preserves remaining order',async()=>{
  let calls=0;assert.deepEqual(await orderedRows({findAll:async()=>{calls++;return [];}},{order:[['id','DESC']],limit:100}),[]);assert.equal(calls,1);
  const model={findAll:async options=>{
    if(options.raw){assert.deepEqual(options.attributes,['id']);return [{id:3},{id:2},{id:1}];}
    assert.deepEqual(options.where.id[Op.in],[3,2,1]);return [{id:1,data:{}},{id:3,data:{}}];
  }};
  assert.deepEqual((await orderedRows(model,{order:[['id','DESC']],limit:100})).map(row=>row.id),[3,1]);
});
