export const TOP_COUNTRY_ARTICLE_TYPE_ID = 2;

function words(value = "") {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .match(/[\p{L}\p{N}]+/gu) ?? [];
}

function isOneEditAway(query, word) {
  if (Math.abs(query.length - word.length) > 1) return false;

  let index = 0;
  while (index < query.length && query[index] === word[index]) index++;

  if (query.length > word.length) {
    return query.slice(index + 1) === word.slice(index);
  }
  if (word.length > query.length) {
    return query.slice(index) === word.slice(index + 1);
  }
  return query.slice(index + 1) === word.slice(index + 1) ||
    (query[index] === word[index + 1] &&
      query[index + 1] === word[index] &&
      query.slice(index + 2) === word.slice(index + 2));
}

function matchScore(query, word) {
  if (word === query) return 0;
  if (word.startsWith(query)) return 1;
  if (query.length >= 4 && isOneEditAway(query, word)) return 2;
  return Infinity;
}

export function rankArticleSearchResults(articles, searchTerm) {
  const query = [...new Set(words(searchTerm))];
  if (!query.length) return [];

  const matches = [];
  for (const article of articles) {
    const candidates = [
      ...words(article.title),
      ...words(article.metatags),
      ...words(article.country?.name),
    ];
    let score = 0;
    for (const term of query) {
      score += candidates.reduce(
        (best, word) => Math.min(best, matchScore(term, word)),
        Infinity
      );
      if (!Number.isFinite(score)) break;
    }
    if (!Number.isFinite(score)) continue;

    const priority = article.countryId == null ? 2 : Number(!article.article_special_types?.length);
    matches.push({ article, priority, score });
  }

  return matches
    .sort((a, b) =>
      a.priority - b.priority ||
      a.score - b.score ||
      b.article.date_written.localeCompare(a.article.date_written) ||
      b.article.id - a.article.id
    )
    .map(({ article }) => article.id);
}
