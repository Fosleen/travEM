// @ts-nocheck

import { formatDate } from "../../../../utils/global";
import ArticleImage from "../../atoms/ArticleImage";
import "./ArticleHero.scss";

const ArticleHero = ({ article }) => {
  return (
    <div className="article-hero-container">
      <div className="article-hero-left">
        <div className="article-hero-titles">
          <h2>{article.title}</h2>
          <h2 className="top">{article.title}</h2>
        </div>
        <h5>
          {formatDate(article.date_written)} {article.user?.first_name}{" "}
          {article.user?.last_name}
        </h5>
        <p>{article.description}</p>
      </div>
      <div className="article-hero-right">
        <ArticleImage article={article} />
      </div>
    </div>
  );
};

export default ArticleHero;
