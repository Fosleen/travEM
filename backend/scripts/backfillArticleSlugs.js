import db from "../app/models/index.js";
import { slugifyArticleTitle } from "../app/utils/articleSlug.js";

const shouldApply = process.argv.includes("--apply");

const run = async () => {
  const articles = await db.models.Article.findAll({
    attributes: ["id", "title", "slug"],
    order: [["id", "ASC"]],
  });

  const reserved = new Set(
    articles.map((article) => article.slug).filter(Boolean)
  );
  const existingSlugs = articles
    .map((article) => article.slug)
    .filter(Boolean);

  if (reserved.size !== existingSlugs.length) {
    throw new Error(
      "Duplicate existing slugs detected. Resolve them before running the backfill."
    );
  }
  const assignments = [];

  for (const article of articles) {
    if (article.slug) continue;

    const baseSlug = slugifyArticleTitle(article.title);
    let slug = baseSlug;
    let suffix = 2;

    while (reserved.has(slug)) {
      slug = `${baseSlug.slice(0, 150 - String(suffix).length - 1)}-${suffix}`;
      suffix += 1;
    }

    reserved.add(slug);
    assignments.push({ id: article.id, title: article.title, slug });
  }

  console.table(assignments);
  console.log(
    shouldApply
      ? `Applying ${assignments.length} slug assignments...`
      : `Preview only: ${assignments.length} articles need slugs. Re-run with --apply after review.`
  );

  if (shouldApply && assignments.length) {
    await db.sequelize.transaction(async (transaction) => {
      for (const assignment of assignments) {
        await db.models.Article.update(
          { slug: assignment.slug },
          { where: { id: assignment.id }, transaction }
        );
      }
    });
  }
};

try {
  await run();
} finally {
  await db.sequelize.close();
}
