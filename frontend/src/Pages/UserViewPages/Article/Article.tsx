import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig";
import ArticleFragment from "../../../components/user/molecules/ArticleFragment/ArticleFragment";
import ArticleHero from "../../../components/user/molecules/ArticleHero";
import ArticleTableOfContents from "../../../components/user/molecules/ArticleTableOfContents/ArticleTableOfContents";
import Grid1 from "../../../assets/images/grid1.png";
import Grid2 from "../../../assets/images/grid2.png";
import Grid3 from "../../../assets/images/grid3.png";
import Grid4 from "../../../assets/images/grid4.png";
import Grid5 from "../../../assets/images/grid5.png";
import Grid6 from "../../../assets/images/grid6.png";
import "./Article.scss";
import Gallery from "react-photo-gallery";
import ArticleReadMore from "../../../components/user/atoms/ArticleReadMore/ArticleReadMore";
import Location from "../../../assets/images/location.png";

const Article = () => {
  const photos = [
    {
      src: Grid1, //larger width means more columns
      width: 1.5,
      height: 1,
    },
    {
      src: Grid2,
      width: 1.5,
      height: 1,
    },
    {
      src: Grid3,
      width: 3,
      height: 1,
    },
    {
      src: Grid4,
      width: 1.5,
      height: 1,
    },
    {
      src: Grid5,
      width: 2,
      height: 1,
    },
    {
      src: Grid6,
      width: 1.5,
      height: 1,
    },
  ];

  return (
    <div>
      <div className="article-container">
        <ArticleHero />
      </div>
      <div className="article-location-parent">
        <div className="article-location">
          <img src={Location} alt="" />
          <h4>Nikozija, Cipar</h4>
        </div>
      </div>

      <ArticleTableOfContents />

      <div className="article-content">
        <ArticleFragment hasImages />
        <ArticleFragment hasImage />
        <ArticleReadMore />
        <ArticleFragment />
        <ArticleFragment hasVideo />
      </div>

      <div className="article-gallery-text-wrapper">
        <h3>Slika govori 1000 riječi</h3>
        <div className="article-location">
          <img src={Location} alt="" />
          <h4>Nikozija, Cipar</h4>
        </div>
      </div>

      <div className="article-gallery-wrapper">
        <Gallery photos={photos} />
      </div>
      <div className="article-text-articles-wrapper">
        <h2>Povezani članci</h2>
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
