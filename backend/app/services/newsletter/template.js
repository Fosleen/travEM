import jwt from 'jsonwebtoken';
import { renderNewsletterHtml } from './newsletterHtml.js';

const articleBadges = {
  1: { icon: '🌍', text: ' DESTINACIJA' },
  2: { icon: '✈️', text: ' AVIOKARTE' },
  3: { icon: '🎒', text: ' PAKIRANJE' },
  4: { icon: '✈️', text: ' LET AVIONOM' },
  5: { icon: '📋', text: ' NOVOSTI I ORGANIZACIJA PUTA' },
  6: { icon: '📱', text: ' APLIKACIJE' },
  7: { icon: '🏨', text: ' SMJEŠTAJ' },
  8: { icon: '💳', text: ' REVOLUT' },
};
const defaultBadge = { icon: '✈️', text: 'PUTOVANJE' };
const htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => htmlEntities[char]);
const imageUrl = (value) => {
  try { const url = new URL(value); return url.protocol === 'https:' ? escape(url.href) : ''; }
  catch { return ''; }
};

export function newsletterTemplate(article, email, secret) {
  if (!secret) throw new Error('JWT_SECRET is required for newsletter unsubscribe links');
  const token = jwt.sign({ email }, secret, { expiresIn: '30d' });
  const unsubscribeUrl = `https://www.putujemstravem.com/otkazi-pretplatu?userToken=${encodeURIComponent(token)}`;
  const url = `https://www.putujemstravem.com/clanak/${encodeURIComponent(article.slug || article.id)}`;
  const badge = articleBadges[article.article_type_id] || defaultBadge;
  const content = {
    ...article,
    article_title: escape(article.article_title),
    article_subtitle: escape(article.article_subtitle),
    article_description: escape(article.article_description),
    mainArticleImage: imageUrl(article.mainArticleImage),
    slug: article.slug ? encodeURIComponent(article.slug) : undefined,
  };
  return {
    html: renderNewsletterHtml(content, badge, unsubscribeUrl),
    text: `${article.article_title}\n\n${article.article_description || ''}\n\nPročitaj članak: ${url}\n\nOva adresa nije namijenjena odgovorima.\nOdjava: ${unsubscribeUrl}`,
  };
}
