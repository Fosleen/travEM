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
