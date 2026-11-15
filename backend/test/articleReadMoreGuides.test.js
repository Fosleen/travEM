import test from 'node:test';
import assert from 'node:assert/strict';
test('guide catalog includes only published destination articles; link-only sections use the existing section model',async()=>{
  process.env.NODE_ENV='test';process.env.DEAL_FINDER_TEST_DB='memory';
  const {default:db}=await import('../app/models/index.js');
  const {createAssociations}=await import('../database_management.js');
  const {default:articles}=await import('../app/services/articleService.js');
  const {default:sections}=await import('../app/services/sectionService.js');
  const {articleGuideSuggestions}=await import('../../client/utils/articleReadMore.mjs');
  const oldFetch=global.fetch;global.fetch=async()=>{throw new Error('No external calls allowed');};
  try{
    assert.equal(db.sequelize.options.storage,':memory:');
    createAssociations();await db.sequelize.sync();
    const user=await db.models.User.create({username:'test-author',password:'test-only',first_name:'Test',last_name:'Author',is_admin:1});
    await db.models.ArticleType.bulkCreate([{id:1,name:'Destinacije'},{id:2,name:'Aviokarte'}]);
    const create=(slug,extra={})=>db.models.Article.create({title:slug.startsWith('rim')?'Rim: vječni vodič za vječni grad':'Cipar: vodič za istraživanje otoka',slug,metatags:'vodič',date_written:'2026-11-15',articleTypeId:1,userId:user.id,...extra});
    const cyprus=await create('cipar-vodic-za-istrazivanje-otoka');
    const rome=await create('rim-vjecni-vodic-za-vjecni-grad');
    await db.models.ArticleReview.create({article_id:rome.id,status:'approved'});
    const pending=await create('pending-guide');await db.models.ArticleReview.create({article_id:pending.id,status:'pending'});
    const scheduled=await create('scheduled-guide');await db.models.ArticleSchedule.create({articleId:scheduled.id,publish_at:new Date(Date.now()+86400000)});
    await create('deal-draft',{is_deal_draft:true});await create('airfare',{articleTypeId:2});
    const catalog=(await articles.getReadMoreGuides()).map(a=>a.toJSON());
    assert.deepEqual(catalog.map(a=>a.id),[cyprus.id,rome.id]);assert.ok(catalog.every(a=>!Object.hasOwn(a,'description')));
    const suggestions=articleGuideSuggestions(catalog,{article_title:'Letovi za Cipar i Rim'});
    assert.equal(suggestions.length,2);
    const link=await sections.addSection('',2,'','Naš vodič za Cipar',suggestions.find(s=>s.id===cyprus.id).url,null,rome.id);
    assert.ok(link.id);assert.equal(link.text,'');assert.equal(link.sectionIconId,null);assert.equal(link.link_title,'Naš vodič za Cipar');
    const stored=await db.models.Section.findByPk(link.id);
    assert.equal(stored.link_url,'https://www.putujemstravem.com/clanak/cipar-vodic-za-istrazivanje-otoka');
    assert.equal(stored.order,2);assert.equal(await db.dealFinder.Budget.count(),0);
  }finally{global.fetch=oldFetch;await db.sequelize.close();}
});
