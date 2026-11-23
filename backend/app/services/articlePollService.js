import {Op,fn,col} from 'sequelize';
import db from '../models/index.js';
import {approvedArticleWhere} from '../utils/articleReviewVisibility.js';
import {defaultArticlePoll,pollKey} from '../../../client/utils/articlePoll.mjs';
import {pollError,pollLabel,pollPercentages,pollToken,pollVoterHash,checkPollSubmission} from '../utils/articlePollSecurity.js';
const {Poll,Option,Vote}=db.articlePoll;
const missingTable=e=>['ER_NO_SUCH_TABLE','42S02'].includes(e?.original?.code)||/no such table/i.test(e?.message||'');
const idValue=value=>{const id=Number(value);if(!Number.isSafeInteger(id)||id<1)throw pollError('Članak nije pronađen.',404);return id;};
async function publicArticle(id,transaction){
  return db.models.Article.findOne({attributes:['id','title','description','metatags','articleTypeId'],include:[{model:db.models.ArticleSchedule,attributes:[],required:false}],where:{id,articleTypeId:2,is_deal_draft:false,[Op.and]:[approvedArticleWhere(),{[Op.or]:[{'$article_schedule.id$':null},{'$article_schedule.publish_at$':null},{'$article_schedule.publish_at$':{[Op.lte]:new Date()}}]}]},transaction});
}
async function lockArticle(id,transaction){
  const article=await db.models.Article.findByPk(id,{transaction,lock:transaction.LOCK.UPDATE});
  if(!article||Number(article.articleTypeId)!==2)throw pollError('Anketa je dostupna samo za članke o aviokartama.',404);
  return article;
}
const optionRows=(id,transaction)=>Option.findAll({where:{article_id:id},order:[['sort_order','ASC'],['id','ASC']],transaction});
async function summary(article,poll,options,hash,transaction,manage=false){
  const vote=hash?await Vote.findOne({where:{article_id:article.id,voter_hash:hash},attributes:['option_id'],transaction}):null;
  const rows=await Vote.findAll({attributes:['option_id',[fn('COUNT',col('id')),'total']],where:{article_id:article.id},group:['option_id'],raw:true,transaction});
  const counts=options.map(option=>Number(rows.find(row=>Number(row.option_id)===option.id)?.total||0));
  const percentages=pollPercentages(counts),show=manage||Boolean(vote);
  return {enabled:poll.enabled,question:poll.question,hasVoted:Boolean(vote),totalVotes:counts.reduce((sum,n)=>sum+n,0),options:options.map((option,index)=>({key:option.normalized_label,label:option.label,...(show?{votes:counts[index],percentage:percentages[index],selected:Boolean(vote)&&option.id===vote.option_id}:{})})),...(!manage?{formToken:pollToken(article.id,hash)}:{})};
}
async function ensurePoll(article,transaction){
  let poll=await Poll.findByPk(article.id,{transaction});
  if(!poll){
    const config=defaultArticlePoll(article.toJSON());
    poll=await Poll.create({article_id:article.id,question:config.question,enabled:true},{transaction});
    await Option.bulkCreate(config.options.map((option,index)=>({article_id:article.id,label:option.label,normalized_label:pollKey(option.label),sort_order:index})),{transaction});
  }
  return poll;
}
export async function pollCapabilities(){
  try{await Promise.all([Poll.findOne({attributes:['article_id']}),Option.findOne({attributes:['id']}),Vote.findOne({attributes:['id']})]);return {available:true};}
  catch(e){if(missingTable(e))return {available:false,migrationRequired:true};throw e;}
}
export async function dealFinderPollResults(){
  try {
    const polls=await Poll.findAll({order:[['article_id','DESC']],raw:true});
    const ids=polls.map(poll=>poll.article_id);
    if(!ids.length)return {available:true,polls:[]};
    const [articles,options,votes]=await Promise.all([
      db.models.Article.findAll({attributes:['id','title'],where:{id:ids},raw:true}),
      Option.findAll({where:{article_id:ids},order:[['sort_order','ASC'],['id','ASC']],raw:true}),
      Vote.findAll({attributes:['option_id',[fn('COUNT',col('id')),'total']],where:{article_id:ids},group:['option_id'],raw:true}),
    ]);
    const articlesById=new Map(articles.map(article=>[article.id,article]));
    const votesByOption=new Map(votes.map(vote=>[Number(vote.option_id),Number(vote.total)]));
    const optionsByArticle=new Map(ids.map(id=>[id,[]]));
    for(const option of options)optionsByArticle.get(option.article_id).push(option);
    return {available:true,polls:polls.filter(poll=>articlesById.has(poll.article_id)).map(poll=>{
      const options=optionsByArticle.get(poll.article_id);
      const counts=options.map(option=>votesByOption.get(option.id)||0);
      const percentages=pollPercentages(counts);
      return {articleId:poll.article_id,title:articlesById.get(poll.article_id).title,
        question:poll.question,enabled:poll.enabled,totalVotes:counts.reduce((sum,count)=>sum+count,0),
        options:options.map((option,index)=>({label:option.label,votes:counts[index],percentage:percentages[index]}))};
    })};
  }catch(error){
    if(missingTable(error))return {available:false,polls:[]};
    throw error;
  }
}
export async function getArticlePoll(value,ip,{manage=false}={}){
  const id=idValue(value),article=manage?await db.models.Article.findByPk(id):await publicArticle(id);
  if(!article||Number(article.articleTypeId)!==2)throw pollError('Anketa nije pronađena.',404);
  try{
    const poll=await Poll.findByPk(id),options=poll?await optionRows(id):defaultArticlePoll(article.toJSON()).options.map(option=>({...option,normalized_label:pollKey(option.label)}));
    if(poll&&!poll.enabled&&!manage)return null;
    const result=await summary(article,poll||defaultArticlePoll(article.toJSON()),options,manage?null:pollVoterHash(id,ip),undefined,manage);
    return {...result,...(manage?{autoOptions:!poll}:{})};
  }catch(e){if(missingTable(e)){if(manage)throw pollError('Prvo primijeni migraciju anketa.',503);return null;}throw e;}
}
export async function voteArticlePoll(value,body,ip){
  const id=idValue(value),hash=pollVoterHash(id,ip);checkPollSubmission(id,body,hash);
  if(Boolean(body.optionKey)===Boolean(body.suggestion))throw pollError('Odaberi jednu opciju ili predloži jednu destinaciju.');
  if(body.optionKey!==undefined&&(typeof body.optionKey!=='string'||body.optionKey.length>80))throw pollError('Neispravan odabir.');
  const suggested=body.suggestion?pollLabel(body.suggestion):null;
  return db.sequelize.transaction(async transaction=>{
    const article=await lockArticle(id,transaction);
    if(!await publicArticle(id,transaction))throw pollError('Anketa nije dostupna.',404);
    const poll=await ensurePoll(article,transaction);if(!poll.enabled)throw pollError('Anketa je zatvorena.',403);
    let options=await optionRows(id,transaction);
    if(await Vote.findOne({where:{article_id:id,voter_hash:hash},transaction}))return summary(article,poll,options,hash,transaction);
    const key=suggested?.key||body.optionKey;
    let option=options.find(option=>option.normalized_label===key);
    if(!option&&suggested){
      if(options.length>=10)throw pollError('Anketa već ima deset opcija. Odaberi jednu od postojećih.',409);
      option=await Option.create({article_id:id,label:suggested.label,normalized_label:suggested.key,sort_order:options.length,is_reader:true},{transaction});
      options=[...options,option];
    }
    if(!option)throw pollError('Ta opcija više nije dostupna. Osvježi anketu.',409);
    await Vote.create({article_id:id,option_id:option.id,voter_hash:hash},{transaction});
    return summary(article,poll,options,hash,transaction);
  });
}
export async function saveArticlePoll(value,input,existingTransaction){
  const id=idValue(value);
  if(!input||typeof input.enabled!=='boolean'||typeof input.question!=='string'||!input.question.trim()||input.question.trim().length>120||!Array.isArray(input.options)||input.options.length<2||input.options.length>10)throw pollError('Anketa treba pitanje do 120 znakova i dvije do deset opcija.');
  const normalized=input.options.map(option=>pollLabel(option.label));
  if(new Set(normalized.map(option=>option.key)).size!==normalized.length)throw pollError('Opcije ankete moraju biti različite.');
  const save=async transaction=>{
    const article=await lockArticle(id,transaction),current=await Poll.findByPk(id,{transaction});
    const old=await optionRows(id,transaction);
    for(const option of old){
      const replacement=normalized.find(item=>item.key===option.normalized_label);
      if((!replacement||replacement.label!==option.label)&&await Vote.count({where:{option_id:option.id},transaction}))throw pollError('Opcije koje imaju glasove ne mogu se preimenovati ili ukloniti.',409);
    }
    if(current)await current.update({enabled:input.enabled,question:input.question.trim()},{transaction});
    else await Poll.create({article_id:id,enabled:input.enabled,question:input.question.trim()},{transaction});
    for(const option of old)if(!normalized.some(item=>item.key===option.normalized_label))await option.destroy({transaction});
    for(const [index,item] of normalized.entries()){
      const oldOption=old.find(option=>option.normalized_label===item.key);
      if(oldOption)await oldOption.update({label:item.label,sort_order:index},{transaction});
      else await Option.create({article_id:id,label:item.label,normalized_label:item.key,sort_order:index},{transaction});
    }
    return summary(article,{enabled:input.enabled,question:input.question.trim()},await optionRows(id,transaction),null,transaction,true);
  };
  return existingTransaction?save(existingTransaction):db.sequelize.transaction(save);
}
