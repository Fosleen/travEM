// SELECT-only by default. Never imports models, syncs tables or starts jobs.
import mysql from 'mysql2/promise';
import config from '../app/config/db-config.js';
import {longSectionUrlsPlan} from './longSectionUrlsPlan.js';
const args=new Set(process.argv.slice(2));let connection;
try{
 if([...args].some(arg=>!['--apply','--backup-confirmed'].includes(arg)))throw new Error('Dopušteno: --apply --backup-confirmed; bez argumenata samo pregled.');
 if(args.has('--apply')&&!args.has('--backup-confirmed'))throw new Error('Primjena zahtijeva --apply --backup-confirmed nakon backupa.');
 connection=await mysql.createConnection({host:config.HOST,user:config.USER,password:config.PASSWORD,database:config.DATABASE,port:Number(config.PORT)||3306,connectTimeout:10000,multipleStatements:false});
 const [rows]=await connection.query("SELECT c.TABLE_NAME,c.COLUMN_NAME,c.DATA_TYPE,c.CHARACTER_MAXIMUM_LENGTH,c.CHARACTER_OCTET_LENGTH,c.CHARACTER_SET_NAME,c.COLLATION_NAME,c.IS_NULLABLE,c.COLUMN_DEFAULT,c.COLUMN_COMMENT,c.EXTRA,t.ENGINE FROM information_schema.COLUMNS c JOIN information_schema.TABLES t ON t.TABLE_SCHEMA=c.TABLE_SCHEMA AND t.TABLE_NAME=c.TABLE_NAME WHERE c.TABLE_SCHEMA=DATABASE() AND ((c.TABLE_NAME='section' AND c.COLUMN_NAME='link_url') OR (c.TABLE_NAME='section_image' AND c.COLUMN_NAME='url'))");
 const plan=longSectionUrlsPlan(rows);
 console.log(args.has('--apply')?'Proširenje URL kolumna: primjena':'READ-ONLY PLAN: nema promjena baze');
 if(!plan.length)console.log('Kolumne već podržavaju URL-ove od najmanje 512 znaka.');
 if(args.has('--apply')){
  await connection.query('SET SESSION lock_wait_timeout=5');
  const [[lock]]=await connection.query("SELECT GET_LOCK('travem_long_section_urls',0) AS acquired");
  if(Number(lock.acquired)!==1)throw new Error('Druga migracija je u tijeku.');
 }
 for(const step of plan){console.log(step.sql+';');if(args.has('--apply'))await connection.query(step.sql);}
 if(!args.has('--apply')&&plan.length)console.log('Nakon pregleda i backupa: npm.cmd run migrate:long-section-urls -- --apply --backup-confirmed');
}catch(error){console.error(error.code?`Migracija zaustavljena (${error.code}); nema fallbacka na COPY ili zaključavanje tablice.`:error.message);console.error('DDL nije jedna transakcija; ponovni pregled preskače već proširene kolumne.');process.exitCode=1;}
finally{if(connection)await connection.end();}
