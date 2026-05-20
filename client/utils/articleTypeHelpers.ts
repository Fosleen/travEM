export const ARTICLE_TYPE_DESTINATION_ID = "1";
export const ARTICLE_TYPE_AIRPLANE_TICKET_ID = "2";

export const TIPS_ARTICLE_TYPE_IDS = [3, 4, 5, 6, 7, 8];

export const TIPS_ARTICLE_TYPE_TITLES: Record<number, string> = {
  3: "Pakiranje",
  4: "Let avionom",
  5: "Organizacija puta",
  6: "Aplikacije",
  7: "Smještaj",
  8: "Revolut",
};

export const isTipsArticleType = (
  articleTypeId: string | number | null | undefined
) => {
  return TIPS_ARTICLE_TYPE_IDS.includes(Number(articleTypeId));
};

export const getTipsArticleTypeTitle = (
  articleTypeId: string | number | null | undefined
) => {
  return TIPS_ARTICLE_TYPE_TITLES[Number(articleTypeId)] || "odabrane rubrike";
};