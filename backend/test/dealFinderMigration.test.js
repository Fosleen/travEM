import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createMigrationPlan, tableDefinitions, airportSeeds } from '../scripts/dealFinderMigrationPlan.js';
import { Sequelize, DataTypes } from 'sequelize';
import defineModels from '../app/models/dealFinder.js';

test('shared DB migration is additive and requires INSTANT on existing tables',()=>{
  const plan=createMigrationPlan({tables:{airport_city:'InnoDB',article:'InnoDB'}});
  const alters=plan.filter(step=>step.sql.startsWith('ALTER'));
  assert.equal(alters.length,2);
  assert.ok(alters.every(step=>step.sql.includes('ADD COLUMN') && step.sql.endsWith('ALGORITHM=INSTANT')));
  assert.equal(plan.filter(step=>step.sql.startsWith('CREATE')).length,5);
  for(const step of plan) assert.doesNotMatch(step.sql,/\b(DROP|DELETE|TRUNCATE|MODIFY|CHANGE)\b/i);
  assert.ok(plan.filter(step=>step.sql.startsWith('UPDATE')).every(step=>step.sql.includes('`iata_codes` IS NULL') && step.sql.includes('`id` = ? AND `name` = ?')));
  const defaults=JSON.parse(plan.at(-1).params[0]);
  assert.equal(defaults.scheduleEnabled,false);
  assert.deepEqual(airportSeeds.find(row=>row[1]==='Venecija')[2],['VCE','TSF']);
});
test('existing schema is skipped on repeat, non-InnoDB tables are refused',()=>{
  const tables={airport_city:'InnoDB',article:'InnoDB',...Object.fromEntries(Object.keys(tableDefinitions).map(name=>[name,'InnoDB']))};
  const plan=createMigrationPlan({tables,columns:{airport_city:['iata_codes'],article:['is_deal_draft']}});
  assert.ok(plan.every(step=>!step.sql.startsWith('CREATE') && !step.sql.startsWith('ALTER')));
  assert.throws(()=>createMigrationPlan({tables:{airport_city:'MyISAM',article:'InnoDB'}}),/InnoDB/);
});
test('migration entrypoint does not load application models or start jobs',async()=>{
  const source=await readFile(new URL('../scripts/migrateDealFinder.js',import.meta.url),'utf8');
  assert.doesNotMatch(source,/import .*models|\.sync\(|changeColumn\(|start.*Job\(/);
  assert.match(source,/args\.has\('--apply'\)/);
  assert.match(source,/args\.has\('--backup-confirmed'\)/);
});
test('new table DDL matches model field names, timestamps and unique run keys',async()=>{
  const database=new Sequelize({dialect:'sqlite',storage:':memory:',logging:false});
  try {
    const plan=createMigrationPlan({tables:{airport_city:'InnoDB',article:'InnoDB'}});
    for(const step of plan.filter(step=>step.sql.startsWith('CREATE'))) {
      // Only adapt dialect syntax, not columns. No configured database is accessed.
      const sql=step.sql.replace(/ ENGINE=InnoDB DEFAULT CHARSET=utf8mb4$/,'')
        .replaceAll('INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY','INTEGER PRIMARY KEY AUTOINCREMENT');
      await database.query(sql);
    }
    const models=defineModels(database,DataTypes);
    await models.Setting.create({id:1,value:{enabled:false}});
    await models.Run.create({key:'scheduled:2027-01-01',input:{origins:['VCE','TSF']}});
    await assert.rejects(()=>models.Run.create({key:'scheduled:2027-01-01'}));
    const offer=await models.Offer.create({key:'VCE:MLA',origin:'VCE',airportCityId:14,articleId:42,data:{flights:[]}});
    await offer.reload();assert.equal(offer.airportCityId,14);assert.equal(offer.articleId,42);
    await models.Audit.create({userId:1,action:'test',payload:{offerId:offer.id}});
    await models.Budget.create({id:'2027-01',used:0});
    assert.equal((await models.Setting.findByPk(1)).value.enabled,false);
  } finally {await database.close();}
});
