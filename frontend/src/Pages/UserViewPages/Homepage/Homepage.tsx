import "./Homepage.scss";
import HomepageHero from "../../../components/user/molecules/HomepageHero";
import FavoritePosts from "../../../components/user/molecules/FavoritePosts";
import HomepageBanner from "../../../components/user/molecules/HomepageBanner";
import OtherPosts from "../../../components/user/molecules/OtherPosts";
import BlogStats from "../../../components/user/molecules/BlogStats";
import DestinationsMap from "../../../components/organisms/DestinationsMap/DestinationsMap";
import RecommendedMapDestinations from "../../../components/user/molecules/RecommendedMapDestinations";
import { getHomepage } from "../../../api/homepage";
import { useContext, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Article, HomepageData } from "../../../common/types";
import { getHomepageArticles } from "../../../api/article";
import { ArticleContext } from "../../../Context/ArticleContext";

const Homepage = () => {
  const { homepageArticles, setHomepageArticles } = useContext(ArticleContext);

  const [homepageContent, setHomepageContent] = useState<HomepageData | null>(
    null
  );
  const [favoriteArticles, setFavoriteArticles] = useState<Array<Article>>([]);
  const [bannerArticles, setBannerArticles] = useState<Array<Article>>([]);
  const [verticalArticles, setVerticalArticles] = useState<Array<Article>>([]);
  const [horizontalArticles, setHorizontalArticles] = useState<Array<Article>>(
    []
  );

  const fetchData = async () => {
    try {
      const content = await getHomepage();
      setHomepageContent(content);

      if (!homepageArticles) {
        const articles = await getHomepageArticles();
        setHomepageArticles(articles);
      }
    } catch (error) {
      console.error("Error occured while fetching homepage data:", error);
    }
  };

  useEffect(() => {
    if (homepageArticles) {
      regroupArticles(homepageArticles);
    }
  }, [homepageArticles]);

  useEffect(() => {
    fetchData();
  }, []);

  const regroupArticles = (articles: Array<Article>) => {
    const favoriteArticlesTemp = articles.filter(
      (article) =>
        article.article_special_types &&
        article.article_special_types.some(
          (type) => type.name === "top_homepage_article"
        )
    );

    const bannerArticlesTemp = articles.filter(
      (article) =>
        article.article_special_types &&
        article.article_special_types.some(
          (type) => type.name === "banner_homepage_article"
        )
    );

    const horizontalArticlesTemp = articles.filter(
      (article) =>
        article.article_special_types &&
        article.article_special_types.some(
          (type) => type.name === "horizontal_homepage_article"
        )
    );

    const verticalArticlesTemp = articles.filter(
      (article) =>
        article.article_special_types &&
        article.article_special_types.some(
          (type) => type.name === "vertical_homepage_article"
        )
    );

    setFavoriteArticles(favoriteArticlesTemp);
    setBannerArticles(bannerArticlesTemp);
    setHorizontalArticles(horizontalArticlesTemp);
    setVerticalArticles(verticalArticlesTemp);
  };

  return (
    <div className="homepage-container">
      {homepageContent ? (
        <>
          <HomepageHero homepageContent={homepageContent} />
          <FavoritePosts homepageArticles={favoriteArticles} />
          <HomepageBanner
            homepageContent={homepageContent}
            homepageArticles={bannerArticles}
          />
          <RecommendedMapDestinations />
          <DestinationsMap
            initialLatitude={51.1657}
            initialLongitude={10.4515}
          />
          <BlogStats homepageContent={homepageContent} />
          <OtherPosts
            verticalArticles={verticalArticles}
            horizontalArticles={horizontalArticles}
          />
        </>
      ) : (
        <ThreeDots
          height="80"
          width="80"
          radius="8"
          color="#2BAC82"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ justifyContent: "center" }}
          visible={true}
        />
      )}
    </div>
  );
};

export default Homepage;
