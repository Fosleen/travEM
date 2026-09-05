type ArticleLinkData = {
  id?: number | string | null;
  slug?: string | null;
};

export const getArticleUrl = (article?: ArticleLinkData | null) => {
  if (article?.slug) {
    return `/clanak/${encodeURIComponent(article.slug)}`;
  }

  return article?.id ? `/clanak/${article.id}` : "/";
};
