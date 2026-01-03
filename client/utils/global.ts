export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}.${month}.${year}.`;
};

export const convertToSlug = (sentence: string) => {
  return sentence.toLowerCase().replace(/\s+/g, "-");
};

export const convertFromSlug = (slug: string) => {
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
};

export const removeCroatianDiacritics = (text: string): string => {
  const diacriticsMap: { [key: string]: string } = {
    č: "c",
    Č: "C",
    ć: "c",
    Ć: "C",
    š: "s",
    Š: "S",
    đ: "d",
    Đ: "D",
    ž: "z",
    Ž: "Z",
  };

  return text.replace(
    /[čćšđžČĆŠĐŽ]/g,
    (match) => diacriticsMap[match] || match
  );
};
