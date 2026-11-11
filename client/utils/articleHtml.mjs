import DOMPurify from 'isomorphic-dompurify';

/** Sanitize first, then apply link behavior only within this article fragment. */
export function sanitizeArticleHtml(html){
 const fragment=DOMPurify.sanitize(String(html||''),{RETURN_DOM_FRAGMENT:true});
 for(const link of fragment.querySelectorAll('a[href]')){
  const rel=new Set((link.getAttribute('rel')||'').split(/\s+/).filter(Boolean).map(value=>value.toLowerCase()));
  rel.add('noopener');rel.add('noreferrer');link.setAttribute('rel',[...rel].join(' '));
  link.setAttribute('target','_blank');
 }
 const container=fragment.ownerDocument.createElement('div');container.appendChild(fragment);
 return container.innerHTML;
}
