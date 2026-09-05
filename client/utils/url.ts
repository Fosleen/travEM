export const safeDecodeURIComponent = (value: string) => {
  if (!value) return "";

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const toUrlSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const fromUrlSlug = (value: string) =>
  safeDecodeURIComponent(value).replace(/-+/g, " ").trim();
