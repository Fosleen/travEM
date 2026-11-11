import mysql from 'mysql2/promise';
export const sectionUrlColumns=[['section','link_url'],['section_image','url']];
export const sectionUrlLength=512;
export function longSectionUrlsPlan(rows){
 return sectionUrlColumns.flatMap(([table,column])=>{
  const row=rows.find(r=>r.TABLE_NAME===table&&r.COLUMN_NAME===column);
  if(!row)throw new Error(`Nedostaje ${table}.${column}`);
  if(row.ENGINE?.toLowerCase()!=='innodb')throw new Error(`${table} nije InnoDB`);
  if(Number(row.CHARACTER_MAXIMUM_LENGTH)>=sectionUrlLength)return [];
  if(row.DATA_TYPE?.toLowerCase()!=='varchar')throw new Error(`Neočekivan tip za ${table}.${column}`);
  const charset=row.CHARACTER_SET_NAME,collation=row.COLLATION_NAME;
  if(!/^[a-z0-9_]+$/i.test(charset||'')||!/^[a-z0-9_]+$/i.test(collation||''))throw new Error('Nepoznat charset ili collation');
  // Changing the length-prefix size cannot be done in place. Refuse rather
  // than silently falling back to a blocking table copy on the shared DB.
  if(!(Number(row.CHARACTER_OCTET_LENGTH)>255))throw new Error(`${table}.${column}: proširenje prelazi granicu duljine u bajtovima; potreban je zaseban plan migracije`);
  if(row.EXTRA)throw new Error(`${table}.${column} ima dodatne atribute; potreban je zaseban pregled`);
  const nullable=row.IS_NULLABLE==='YES';
  const defaultSql=row.COLUMN_DEFAULT!=null?` DEFAULT ${mysql.escape(row.COLUMN_DEFAULT)}`:nullable?' DEFAULT NULL':'';
  const commentSql=row.COLUMN_COMMENT?` COMMENT ${mysql.escape(row.COLUMN_COMMENT)}`:'';
  return [{table,column,sql:`ALTER TABLE \`${table}\` MODIFY COLUMN \`${column}\` VARCHAR(${sectionUrlLength}) CHARACTER SET ${charset} COLLATE ${collation} ${nullable?'NULL':'NOT NULL'}${defaultSql}${commentSql}, ALGORITHM=INPLACE, LOCK=NONE`}];
 });
}
