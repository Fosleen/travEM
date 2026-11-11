import test from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeArticleHtml} from '../../client/utils/articleHtml.mjs';

test('existing and new article body links open in a new tab and retain affiliate attributes',()=>{
 const html=sanitizeArticleHtml('<p><a href="https://example.com" target="_self" rel="sponsored nofollow">Ponuda</a> i <a href="/clanak/vodic">Vodič</a></p>');
 assert.equal((html.match(/target="_blank"/g)||[]).length,2);
 assert.match(html,/rel="sponsored nofollow noopener noreferrer"/);assert.match(html,/href="\/clanak\/vodic"/);
 assert.equal(sanitizeArticleHtml(html),html);
});
test('opening links in a new tab does not bypass HTML sanitization',()=>{
 const html=sanitizeArticleHtml('<script>alert(1)</script><a href="javascript:alert(1)" onclick="bad()">Loš link</a><a href="https://example.com" rel="noopener">Dobar link</a>');
 assert.doesNotMatch(html,/script|onclick|javascript:/);assert.equal((html.match(/target="_blank"/g)||[]).length,1);assert.match(html,/rel="noopener noreferrer"/);
});
