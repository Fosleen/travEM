// @ts-nocheck

import { formatDate } from "../../../../utils/global";
import ArticleImage from "../../atoms/ArticleImage";
import "./ArticleHero.scss";

const ArticleHero = ({ article }) => {
  const authorName =
    article.user?.username === "Dox" || article.user?.username === "Ema"
      ? "putujEM s travEM - Ema i Matija"
      : `${article.user?.first_name || ""} ${article.user?.last_name || ""}`.trim();

  return (
    <div className="article-hero-container">
      <div className="article-hero-left">
        <div className="article-hero-titles">
          <h2>{article.title}</h2>
        </div>

        <div className="article-hero-meta">
          {article.date_updated && (
            <h5>
              <span>Ažurirano:</span> {formatDate(article.date_updated)}
            </h5>
          )}

          <h5>
            <span>Objavljeno:</span> {formatDate(article.date_written)}
          </h5>

          <h5>
            <span>Piše:</span> {authorName}
          </h5>
        </div>

        <p>{article.description}</p>
      </div>

      <div className="article-hero-right">
        <ArticleImage article={article} />
      </div>
    </div>
  );
};

export default ArticleHero;
