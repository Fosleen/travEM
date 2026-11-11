// Default: SELECT-only preview. No models import, ORM sync, workers or application startup.
import mysql from 'mysql2/promise';
import dbConfig from '../app/config/db-config.js';
import { createMigrationPlan, migrationTables } from './dealFinderMigrationPlan.js';

const args = new Set(process.argv.slice(2));
let connection;
try {
  if ([...args].some(arg => !['--apply','--backup-confirmed','--help'].includes(arg))) {
    throw new Error('Nepodržan argument. Koristite --help. Automatski --down nije dopušten na zajedničkoj bazi.');
  }
  if (args.has('--help')) {
    console.log('Bez argumenata: read-only pregled i plan. --apply --backup-confirmed: aditivna primjena nakon backupa. Nema promjene tipa opisa, brisanja ni pokretanja aplikacije.');
  } else {
    if (args.has('--apply') && !args.has('--backup-confirmed')) throw new Error('Prvo napravite backup. Primjena zahtijeva --apply --backup-confirmed.');
    connection = await mysql.createConnection({
      host: dbConfig.HOST, user: dbConfig.USER, password: dbConfig.PASSWORD,
      database: dbConfig.DATABASE, port: Number(dbConfig.PORT) || 3306,
      connectTimeout: 10000, multipleStatements: false,
    });
    if (args.has('--apply')) {
      await connection.query('SET SESSION lock_wait_timeout = 5');
      await connection.query('SET SESSION innodb_lock_wait_timeout = 5');
      const [[lock]] = await connection.query("SELECT GET_LOCK('travem_deal_finder_migration', 0) AS acquired");
      if (Number(lock.acquired) !== 1) throw new Error('Druga migracija je u tijeku; ništa nije primijenjeno.');
    }
    const [[server]] = await connection.query('SELECT VERSION() AS version, DATABASE() AS db');
    const placeholders = migrationTables.map(() => '?').join(',');
    const [tableRows] = await connection.execute(`SELECT TABLE_NAME, ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (${placeholders})`, migrationTables);
    const [columnRows] = await connection.execute(`SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (${placeholders})`, migrationTables);
    const tables = Object.fromEntries(tableRows.map(row => [row.TABLE_NAME,row.ENGINE]));
    const columns = {};
    for (const row of columnRows) (columns[row.TABLE_NAME] ||= []).push(row.COLUMN_NAME);
    const plan = createMigrationPlan({tables,columns});
    const description = columnRows.find(row => row.TABLE_NAME === 'article' && row.COLUMN_NAME === 'description');
    console.log(`Baza: ${server.db}; server: ${server.version}`);
    console.log(`Opis članka: ${description?.DATA_TYPE || 'nije pronađen'}, kapacitet: ${description?.CHARACTER_MAXIMUM_LENGTH ?? 'nepoznat'}. Ova migracija ga NE mijenja.`);
    console.log(args.has('--apply') ? 'ADITIVNA PRIMJENA' : 'READ-ONLY PLAN: nema upisa ni DDL operacija');
    for (const [index, step] of plan.entries()) {
      console.log(`${index+1}. ${step.label}\n   ${step.sql}`);
      if (args.has('--apply')) {
        const [result] = await connection.execute(step.sql, step.params || []);
        console.log(`   Završeno; affectedRows: ${result.affectedRows ?? 0}`);
      }
    }
    if (args.has('--apply')) console.log('Dovršeno. Live pretrage i CMS export nisu uključeni. Restart lokalnog backenda pokrenite zasebno.');
    else console.log('Nakon backupa: npm.cmd run migrate:deal-finder -- --apply --backup-confirmed');
  }
} catch (error) {
  // Driver messages may contain host/user/query details; never print credentials or SQL error objects.
  console.error(error.code ? `Migracija je zaustavljena (${error.code}). Nema automatskog fallbacka na COPY/INPLACE; pregledajte uzrok prije ponavljanja.` : error.message);
  console.error('DDL u MySQL-u nije jedna transakcija. Ako je primjena već počela, uspješni aditivni koraci ostaju; ponovni pregled preskače postojeće kolumne/tablice.');
  process.exitCode = 1;
} finally {
  if (connection) await connection.end(); // Also releases the advisory lock.
}
