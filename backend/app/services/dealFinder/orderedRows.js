import {Op} from 'sequelize';

// MySQL filesort can copy selected JSON columns into its sort buffer.
// Sort only small IDs, then load the selected payloads without ORDER BY.
export async function orderedRows(model,{where,order,limit}) {
  const keys=await model.findAll({attributes:['id'],where,order,limit,raw:true});
  if(!keys.length)return [];
  const ids=keys.map(row=>row.id);
  const rows=await model.findAll({where:{id:{[Op.in]:ids}}});
  const byId=new Map(rows.map(row=>[String(row.id),row]));
  // Preserve SQL ordering and tolerate rows deleted between these read-only queries.
  return ids.map(id=>byId.get(String(id))).filter(Boolean);
}
