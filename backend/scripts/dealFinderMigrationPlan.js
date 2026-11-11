import { defaults } from '../app/services/dealFinder/domain.js';

export const airportSeeds = [
  [1,'Zagreb',['ZAG']],[2,'Split',['SPU']],[3,'Dubrovnik',['DBV']],
  [4,'Zadar',['ZAD']],[9,'Beograd',['BEG']],[10,'Sarajevo',['SJJ']],
  [11,'Trst',['TRS']],[12,'Beč',['VIE']],[13,'Budimpešta',['BUD']],
  [14,'Venecija',['VCE','TSF']],[15,'Pula',['PUY']],[16,'Rijeka',['RJK']],
  [17,'Osijek',['OSI']],[18,'Tuzla',['TZL']],[19,'Banja Luka',['BNX']],
  [20,'Ljubljana',['LJU']],
];
const timestampColumns = '`created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL';
const autoId = '`id` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY';
export const tableDefinitions = {
  deal_finder_setting: '`id` INTEGER NOT NULL PRIMARY KEY, `value` JSON NOT NULL',
  deal_finder_run: `${autoId}, \`key\` VARCHAR(120) NOT NULL UNIQUE, \`source\` VARCHAR(255), \`status\` VARCHAR(255), \`input\` JSON, \`usage\` INTEGER DEFAULT 0, \`error\` TEXT`,
  deal_finder_offer: `${autoId}, \`key\` VARCHAR(120) NOT NULL UNIQUE, \`origin\` VARCHAR(3), \`destination\` VARCHAR(3), \`airport_city_id\` INTEGER, \`source\` VARCHAR(255), \`status\` VARCHAR(255), \`data\` JSON, \`selection\` JSON, \`article_id\` INTEGER, \`provenance\` JSON`,
  deal_finder_budget: '`id` VARCHAR(7) NOT NULL PRIMARY KEY, `used` INTEGER DEFAULT 0',
  deal_finder_audit: `${autoId}, \`user_id\` INTEGER, \`action\` VARCHAR(255), \`payload\` JSON`,
};
export const migrationTables = ['airport_city','article',...Object.keys(tableDefinitions)];
export function createMigrationPlan({ tables = {}, columns = {} } = {}) {
  const plan = [];
  for (const name of ['airport_city','article']) {
    if (!tables[name]) throw new Error(`Nedostaje postojeća CMS tablica: ${name}`);
    if (tables[name].toLowerCase() !== 'innodb') throw new Error(`Tablica ${name} nije InnoDB; potreban je zaseban pregled.`);
  }
  if (!columns.airport_city?.includes('iata_codes')) plan.push({
    label: 'Dodaj popis IATA kodova (isključivo INSTANT)',
    sql: 'ALTER TABLE `airport_city` ADD COLUMN `iata_codes` JSON NULL, ALGORITHM=INSTANT',
  });
  if (!columns.article?.includes('is_deal_draft')) plan.push({
    label: 'Dodaj oznaku nacrta; postojeći članci ostaju javni kao dosad',
    sql: 'ALTER TABLE `article` ADD COLUMN `is_deal_draft` TINYINT(1) NOT NULL DEFAULT 0, ALGORITHM=INSTANT',
  });
  for (const [name, definition] of Object.entries(tableDefinitions)) if (!tables[name]) {
    plan.push({ label: `Kreiraj novu tablicu ${name}`,
      sql: `CREATE TABLE IF NOT EXISTS \`${name}\` (${definition}, ${timestampColumns}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4` });
  }
  for (const [id,name,codes] of airportSeeds) plan.push({
    label: `Dopuni IATA kodove: ${name} (${codes.join(', ')}) samo ako je polje NULL`,
    sql: 'UPDATE `airport_city` SET `iata_codes` = ? WHERE `id` = ? AND `name` = ? AND `is_active` = 1 AND `iata_codes` IS NULL',
    params: [JSON.stringify(codes),id,name],
  });
  plan.push({
    label: 'Dodaj početne isključene postavke samo ako još ne postoje',
    sql: 'INSERT INTO `deal_finder_setting` (`id`,`value`,`created_at`,`updated_at`) SELECT 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP WHERE NOT EXISTS (SELECT 1 FROM `deal_finder_setting` WHERE `id` = 1)',
    params: [JSON.stringify(defaults)],
  });
  return plan;
}
