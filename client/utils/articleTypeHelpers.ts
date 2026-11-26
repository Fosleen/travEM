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

export const TIPS_CATEGORY_ICONS = {
  pakiranje: "/images/luggage-icon.png",
  "let-avionom": "/images/airport-icon.png",
  "organizacija-puta": "/images/travel-org-icon.png",
  aplikacije: "/images/travel-app-icon.png",
  smjestaj: "/images/bed-icon.png",
  revolut: "/images/cards-icon.png",
};

const tipsCategoryByTypeId: Partial<Record<number, keyof typeof TIPS_CATEGORY_ICONS>> = {
  3: "pakiranje",
  4: "let-avionom",
  5: "organizacija-puta",
  6: "aplikacije",
  7: "smjestaj",
  8: "revolut",
};

export const getTipsArticleTypeIcon = (articleTypeId: string | number) => {
  const category = tipsCategoryByTypeId[Number(articleTypeId)];
  return category && TIPS_CATEGORY_ICONS[category];
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
