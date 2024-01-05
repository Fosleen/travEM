import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig";
import ArticleFragment from "../../../components/user/molecules/ArticleFragment/ArticleFragment";
import ArticleHero from "../../../components/user/molecules/ArticleHero";
import ArticleTableOfContents from "../../../components/user/molecules/ArticleTableOfContents/ArticleTableOfContents";
import "./Article.scss";

const Article = () => {
  return (
    <div>
      <div className="article-container">
        <ArticleHero />
      </div>

      <ArticleTableOfContents />
      <div className="article-content">
        <ArticleFragment hasImages />
        <ArticleFragment hasImage />
        <ArticleFragment />
        <ArticleFragment hasVideo />

        <div className="article-text-articles-wrapper">
          <h2>Povezani članci</h2>
        </div>
      </div>
      <div className="article-connected-articles-wrapper">
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
      </div>
    </div>
  );
};

export default Article;
