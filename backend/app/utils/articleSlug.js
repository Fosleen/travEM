import { Op } from "sequelize";

export const slugifyArticleTitle = (value) => {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150)
    .replace(/-+$/g, "");

  if (!slug) return "clanak";
  return /^\d+$/.test(slug) ? `clanak-${slug}` : slug;
};

export const createUniqueArticleSlug = async (
  Article,
  title,
  { transaction, excludeId } = {}
) => {
  const baseSlug = slugifyArticleTitle(title);
  let slug = baseSlug;
  let suffix = 2;

  while (
    await Article.findOne({
      attributes: ["id"],
      where: {
        slug,
        ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
      },
      transaction,
    })
  ) {
    slug = `${baseSlug.slice(0, 150 - String(suffix).length - 1)}-${suffix}`;
    suffix += 1;
  }

  return slug;
};
