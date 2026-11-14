import { Router } from 'express';
import db from '../models/index.js';
import { verifyToken } from '../middleware/jwt_verify.js';
import * as service from '../services/dealFinder/service.js';
import {orderedRows} from '../services/dealFinder/orderedRows.js';
import {templateEditorial} from '../services/dealFinder/textGeneration.js';
import { editorial, assert, evaluateStay, renderSelection, renderHostel, effectiveSettings,renderAlternativeHotels } from '../services/dealFinder/domain.js';
import { clearCache, clearCacheByPattern } from '../middleware/redis.js';
import {searchAirports,searchFlightDestinations,offerAirportNames,discoveryDestinationAllowed} from '../services/dealFinder/airports.js';
const router=Router();
router.use(verifyToken);
router.use(async(req,res,next)=>{
  try { const user=await db.models.User.findByPk(req.user.id); if(!user || Number(user.is_admin)!==1) return res.status(403).json({error:'Potreban je administratorski pristup'});next(); }
  catch {res.status(503).json({error:'Provjera ovlasti nije dostupna'});}
});
const wrap=fn=>async(req,res)=>{try {res.json(await fn(req));}catch(e){res.status(400).json({error:e.message});}};
router.get('/settings',wrap(()=>service.settings()));
router.put('/settings',wrap(req=>service.saveSettings(req.body,req.user.id)));
router.get('/origins',wrap(()=>service.origins()));
router.get('/airports',wrap(req=>req.query.includeCities==='true'?searchFlightDestinations(req.query.q):searchAirports(req.query.q)));
router.get('/budget',wrap(()=>service.budget()));
router.get('/runs',wrap(()=>orderedRows(db.dealFinder.Run,{order:[['createdAt','DESC'],['id','DESC']],limit:100})));
router.get('/runs/:id',wrap(async req=>{const run=await db.dealFinder.Run.findByPk(req.params.id);assert(run,'Pretraga ne postoji');return run;}));
router.get('/offers',wrap(async()=>{
  const priority=db.sequelize.literal("CASE WHEN status = 'ready_for_selection' THEN -1 WHEN status IN ('needs_verification','discovered','unverified','stale') THEN 0 WHEN status = 'rejected' THEN 2 ELSE 1 END");
  const offers=await orderedRows(db.dealFinder.Offer,{order:[[priority,'ASC'],['updatedAt','DESC'],['id','DESC']],limit:200});
  const origins=await service.origins();
  return offers.filter(o=>o.provenance?.coverage!=='discovery_highlights'||discoveryDestinationAllowed(o.origin,o.destination)).map(o=>offerAirportNames(o,origins));
}));
router.post('/offers/delete-all',wrap(async req=>{
  assert(req.body.confirm===true,'Potvrdite trajno brisanje svih ponuda');
  return db.sequelize.transaction(async transaction=>{
    const deleted=await db.dealFinder.Offer.destroy({where:{},transaction});
    await service.audit(req.user.id,'delete_all_offers',{deleted},transaction);
    return {deleted};
  });
}));
router.post('/offers/:id/dismiss',wrap(async req=>{
  return db.sequelize.transaction(async transaction=>{
    const o=await db.dealFinder.Offer.findByPk(req.params.id,{transaction,lock:transaction.LOCK.UPDATE});assert(o,'Ponuda ne postoji');
    await o.destroy({transaction});
    await service.audit(req.user.id,'delete_offer',{id:o.id},transaction);
    return {id:o.id};
  });
}));
router.get('/offers/:id',wrap(req=>service.detail(req.params.id)));
router.post('/search',wrap(req=>service.startSearch(req.body,req.user.id)));
router.post('/offers/:id/select',wrap(req=>service.select(req.params.id,req.body,req.user.id)));
router.post('/offers/:id/search-flights',wrap(req=>service.searchOfferFlights(req.params.id,req.body,req.user.id)));
router.post('/offers/:id/confirm-candidate',wrap(req=>service.confirmFlightCandidate(req.params.id,req.body,req.user.id)));
router.post('/offers/:id/manual-flight',wrap(req=>service.addManualFlight(req.params.id,req.body,req.user.id)));
router.post('/offers/:id/verify',wrap(req=>service.verify(req.params.id,req.body,req.user.id)));
router.post('/offers/:id/generate-draft',wrap(req=>service.generateDraft(req.params.id,req.body,req.user.id)));
router.post('/offers/:id/build-content',wrap(req=>service.buildContent(req.params.id,req.body,req.user.id)));
router.post('/offers/:id/article-form',wrap(req=>service.articleForm(req.params.id,req.body)));
router.get('/offers/:id/preview',wrap(async req=>{
  const o=await db.dealFinder.Offer.findByPk(req.params.id);assert(o?.selection,'Spremite izbor');
  const s=await service.settings();
  return {html:renderSelection(o,await service.selectedFlights(o),o.selection.template==='monthly'?null:o.data.hotels[o.selection.hotelIndex],s)+renderAlternativeHotels(o,(o.selection.extraHotelIndices||[]).map(i=>o.data.hotels[i]),s)+renderHostel(o.selection.hostel,s)};
}));
router.post('/offers/:id/regenerate-field',wrap(async req=>{
  const o=await service.detail(req.params.id), fields=o.selection?.template==='roundup'?templateEditorial(o):editorial(o);
  assert(['intro','titles','descriptions','subtitle','subtitles','tags'].includes(req.body.field),'Nepoznato polje');
  return {field:req.body.field,value:fields[req.body.field]};
}));
router.post('/offers/:id/status',wrap(async req=>{
  assert(['rejected','expired','needs_verification'].includes(req.body.status),'Nedozvoljen status');
  const o=await db.dealFinder.Offer.findByPk(req.params.id);assert(o,'Ponuda ne postoji');
  await o.update({status:req.body.status});await service.audit(req.user.id,'status',{id:o.id,status:o.status});return o;
}));
// Publishing remains a deliberate editor action. This only unlocks a fully reviewed draft.
router.post('/offers/:id/approve',wrap(async req=>{
  const result=await db.sequelize.transaction(async transaction=>{
  const o=await db.dealFinder.Offer.findByPk(req.params.id,{transaction,lock:transaction.LOCK.UPDATE}),s=await service.settings();assert(o?.articleId && o.selection,'Nacrt ne postoji');

  const fresh=x=>x.available===true && x.verifiedAt;
  const flights=await service.selectedFlights(o,o.selection,transaction);
  assert(flights.every(fresh),'Ponovno provjerite sve odabrane letove');
  const h=o.selection.template==='monthly'?null:o.data.hotels[o.selection.hotelIndex];
  if(h) assert(fresh(h) && h.ratePolicyVerified && !evaluateStay(h,effectiveSettings(s,o.destination,o.provenance?.overrides)).reasons.length,'Ponovno provjerite cijenu, tarifu i geografiju smještaja');
  const extraHotels=(o.selection.extraHotelIndices||[]).map(i=>o.data.hotels[i]);
  assert(extraHotels.every(x=>fresh(x) && x.ratePolicyVerified && !evaluateStay(x,effectiveSettings(s,o.destination,o.provenance?.overrides)).reasons.length),'Provjerite dodatne hotele');
  assert(req.body.confirm===true,'Potrebno je izričito uredničko odobrenje');
  const generated=o.provenance.generatedFacts;
  assert(generated && generated.flights.every(f=>f.verifiedAt && f.available===true) && (!h || generated.hotel?.verifiedAt),'Nacrt je nastao iz nepotvrđenih podataka. Izradite nov nacrt nakon provjere.');
  assert(JSON.stringify(generated.flights)===JSON.stringify(flights) && JSON.stringify(generated.hotel)===JSON.stringify(h),'Podaci su promijenjeni nakon izrade nacrta; potreban je novi nacrt');
  assert(JSON.stringify(generated.extraHotels||[])===JSON.stringify(extraHotels),'Dodatni hoteli su promijenjeni nakon izrade nacrta');
  if(o.selection.hostel) assert((typeof o.selection.hostel.description==='string' || fresh(o.selection.hostel)) && JSON.stringify(generated.hostel)===JSON.stringify(o.selection.hostel),'Ponovno provjerite hostel');
    const article=await db.models.Article.findByPk(o.articleId,{transaction,lock:transaction.LOCK.UPDATE});
    assert(article.is_deal_draft,'Članak je već odobren');
    assert(article.airportCityId===o.airportCityId,'Polazište članka je promijenjeno');
    assert(article.description?.trim().length>0 && article.description.length<=100,'Opis mora imati najviše 100 znakova');
    const schedule=await db.models.ArticleSchedule.findOne({where:{articleId:article.id},transaction});
    if(schedule) await schedule.update({publish_at:null,notify_subscribers_on_publish:false},{transaction});
    await article.update({is_deal_draft:false},{transaction});
    await o.destroy({transaction});
    await service.audit(req.user.id,'manual_publish_approval',{offerId:o.id,articleId:article.id},transaction);
    return {articleId:o.articleId,status:'published'};
  });
  await Promise.all([clearCache(`article:${result.articleId}`),clearCache(`article:${result.articleId}:admin`),clearCacheByPattern('homepage*')]);
  return result;
}));
export default router;
