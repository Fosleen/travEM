// @ts-nocheck
"use client";

import "./Homepage.scss";
import HomepageHero from "@/components/user/molecules/HomepageHero";
import FavoritePosts from "@/components/user/molecules/FavoritePosts";
import HomepageBanner from "@/components/user/molecules/HomepageBanner";
import OtherPosts from "@/components/user/molecules/OtherPosts";
import BlogStats from "@/components/user/molecules/BlogStats";
import DestinationsMap from "@/components/organisms/DestinationsMap";
import { useContext, useEffect, useMemo } from "react";
import { ArticleContext } from "@/context/ArticleContext";
import RecommendedMapDestinations from "@/components/user/molecules/RecommendedMapDestinations";
import { Article, HomepageData } from "@/common/types";

interface HomepageProps {
  initialContent: HomepageData;
  initialArticles: Array<Article>;
}

const Homepage = ({ initialContent, initialArticles }: HomepageProps) => {
  const { setHomepageArticlesContextData } = useContext(ArticleContext);

  useEffect(() => {
    setHomepageArticlesContextData(initialArticles);
  }, [initialArticles, setHomepageArticlesContextData]);

  const favoriteArticles = useMemo(() => {
    return initialArticles.filter((article) =>
      article.article_special_types?.some(
        (type) => type.name === "top_homepage_article"
      )
    );
  }, [initialArticles]);

  const bannerArticles = useMemo(() => {
    return initialArticles.filter((article) =>
      article.article_special_types?.some(
        (type) => type.name === "banner_homepage_article"
      )
    );
  }, [initialArticles]);

  const horizontalArticles = useMemo(() => {
    return initialArticles.filter((article) =>
      article.article_special_types?.some(
        (type) => type.name === "horizontal_homepage_article"
      )
    );
  }, [initialArticles]);

  const verticalArticles = useMemo(() => {
    return initialArticles.filter((article) =>
      article.article_special_types?.some(
        (type) => type.name === "vertical_homepage_article"
      )
    );
  }, [initialArticles]);

  return (
    <div className="homepage-container">
      <HomepageHero homepageContent={initialContent} />
      <FavoritePosts homepageArticles={favoriteArticles} />
      <HomepageBanner
        homepageContent={initialContent}
        homepageArticles={bannerArticles}
      />
      <RecommendedMapDestinations />
      <DestinationsMap initialLatitude={51.1657} initialLongitude={10.4515} />
      <BlogStats homepageContent={initialContent} />
      <OtherPosts
        verticalArticles={verticalArticles}
        horizontalArticles={horizontalArticles}
      />
    </div>
  );
};

export default Homepage;
