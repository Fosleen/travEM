export default (sequelize,D)=>{
  const options={underscored:true,freezeTableName:true,timestamps:true};
  const Poll=sequelize.define('article_destination_poll',{
    article_id:{type:D.INTEGER,primaryKey:true,references:{model:'article',key:'id'},onDelete:'CASCADE'},
    question:{type:D.STRING(120),allowNull:false},enabled:{type:D.BOOLEAN,allowNull:false,defaultValue:true},
  },options);
  const Option=sequelize.define('article_destination_poll_option',{
    article_id:{type:D.INTEGER,allowNull:false,references:{model:'article_destination_poll',key:'article_id'},onDelete:'CASCADE'},
    label:{type:D.STRING(60),allowNull:false},normalized_label:{type:D.STRING(80),allowNull:false},
    sort_order:{type:D.INTEGER,allowNull:false},is_reader:{type:D.BOOLEAN,allowNull:false,defaultValue:false},
  },{...options,indexes:[{unique:true,fields:['article_id','normalized_label']}]});
  const Vote=sequelize.define('article_destination_poll_vote',{
    article_id:{type:D.INTEGER,allowNull:false,references:{model:'article_destination_poll',key:'article_id'},onDelete:'CASCADE'},
    option_id:{type:D.INTEGER,allowNull:false,references:{model:'article_destination_poll_option',key:'id'},onDelete:'CASCADE'},
    voter_hash:{type:D.STRING(64),allowNull:false},
  },{...options,indexes:[{unique:true,fields:['article_id','voter_hash']},{fields:['option_id']}]});
  return {Poll,Option,Vote};
};
