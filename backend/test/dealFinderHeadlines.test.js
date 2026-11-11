import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverEditorial} from '../app/services/dealFinder/editorialRecovery.js';
import {resolveEditorialText} from '../app/services/dealFinder/textGeneration.js';

test('generated headlines and summaries omit origin even when the model includes it',()=>{
  const facts={tokens:{headline_price:'139€',package_price_short:'139€'},context:{originName:'Zagreb',originAirport:'ZAG',destinationName:'Prag',destinationAirport:'PRG',hotels:[]}};
  const result=recoverEditorial({titles:['Advent u Pragu iz Zagreba: let i smještaj od 139€ po osobi','Advent u Pragu: let i smještaj od {{headline_price}} po osobi'],descriptions:['Odlične ponude iz Zagreba za Prag! Pogledaj termine povratnih letova i primjer smještaja.'],intro:'Vrijeme je za adventsko putovanje.'},facts,resolveEditorialText);
  assert.ok(result.titles.length>=5);
  assert.ok(result.titles.includes('Advent u Pragu: let i smještaj od 139€ po osobi'));
  for(const text of [...result.titles,...result.descriptions]){assert.doesNotMatch(text,/Zagreb|ZAG/);assert.ok(text.length<=100);}
});
