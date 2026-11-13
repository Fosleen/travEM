import { Op, literal } from "sequelize";

// No join is needed, so this also works in nested country/place queries.
export const approvedArticleWhere = (idAttribute = "id") => ({
  [idAttribute]: { [Op.notIn]: literal("(SELECT article_id FROM article_review WHERE status <> 'approved')") },
});
