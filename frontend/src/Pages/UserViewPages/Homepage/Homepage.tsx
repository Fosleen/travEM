import "./Homepage.scss";
import HomepageHero from "../../../components/user/molecules/HomepageHero";
import FavoritePosts from "../../../components/user/molecules/FavoritePosts";
import HomepageBanner from "../../../components/user/molecules/HomepageBanner";
import OtherPosts from "../../../components/user/molecules/OtherPosts";
import BlogStats from "../../../components/user/molecules/BlogStats";
import DestinationsMap from "../../../components/organisms/DestinationsMap/DestinationsMap";
import RecommendedMapDestinations from "../../../components/user/molecules/RecommendedMapDestinations";
import { getHomepage } from "../../../api/homepage";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Article, HomepageData } from "../../../common/types";
import { getHomepageArticles } from "../../../api/article";
import Ad from "../../../components/atoms/Ad";
import { Adsense } from "@ctrl/react-adsense";

const Homepage = () => {
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
      const articles = await getHomepageArticles();
      setHomepageContent(content);
      regroupArticles(articles);
    } catch (error) {
      console.error("Error occured while fetching homepage data:", error);
    }
  };

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
          <Adsense client="ca-pub-3489990178681903" slot="7259870550" />
          <RecommendedMapDestinations />
          <DestinationsMap
            initialLatitude={51.1657}
            initialLongitude={10.4515}
          />
          <Adsense
            client="ca-pub-3489990178681903"
            slot="7259870551"
            style={{ width: 500, height: 300 }}
            format=""
          />
          <BlogStats homepageContent={homepageContent} />
          <Ad dataAdSlot="12345678" />
          <OtherPosts
            verticalArticles={verticalArticles}
            horizontalArticles={horizontalArticles}
          />
          <Adsense
            client="ca-pub-3489990178681903"
            slot="7259870552"
            style={{ display: "block" }}
            layout="in-article"
            format="fluid"
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
