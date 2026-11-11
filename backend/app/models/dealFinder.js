export default (sequelize, D) => {
  const options={underscored:true,freezeTableName:true,timestamps:true};
  const Setting=sequelize.define('deal_finder_setting',{id:{type:D.INTEGER,primaryKey:true},value:{type:D.JSON,allowNull:false}},options);
  const Run=sequelize.define('deal_finder_run',{key:{type:D.STRING(120),unique:true,allowNull:false},source:D.STRING,status:D.STRING,input:D.JSON,usage:{type:D.INTEGER,defaultValue:0},error:D.TEXT},options);
  const Offer=sequelize.define('deal_finder_offer',{key:{type:D.STRING(120),unique:true,allowNull:false},origin:D.STRING(3),destination:D.STRING(3),airportCityId:D.INTEGER,source:D.STRING,status:D.STRING,data:D.JSON,selection:D.JSON,articleId:D.INTEGER,provenance:D.JSON},options);
  const Budget=sequelize.define('deal_finder_budget',{id:{type:D.STRING(7),primaryKey:true},used:{type:D.INTEGER,defaultValue:0}},options);
  const Audit=sequelize.define('deal_finder_audit',{userId:D.INTEGER,action:D.STRING,payload:D.JSON},options);
  return {Setting,Run,Offer,Budget,Audit};
};
