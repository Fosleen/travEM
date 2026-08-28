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
import { Article, FooterPartnerData, HomepageData } from "@/common/types";
import PartnerShowcase from "@/components/user/molecules/PartnerShowcase";

interface HomepageProps {
  initialContent: HomepageData;
  initialArticles: Array<Article>;
  initialPartners: FooterPartnerData[];
}

const Homepage = ({
  initialContent,
  initialArticles,
  initialPartners,
}: HomepageProps) => {
  const { setHomepageArticlesContextData } = useContext(ArticleContext);
  const articles = useMemo(
    () => (Array.isArray(initialArticles) ? initialArticles : []),
    [initialArticles]
  );

  useEffect(() => {
    setHomepageArticlesContextData(articles);
  }, [articles, setHomepageArticlesContextData]);

  const favoriteArticles = useMemo(() => {
    return articles.filter((article) =>
      article.article_special_types?.some(
        (type) => type.name === "top_homepage_article"
      )
    );
  }, [articles]);

  const bannerArticles = useMemo(() => {
    return articles.filter((article) =>
      article.article_special_types?.some(
        (type) => type.name === "banner_homepage_article"
      )
    );
  }, [articles]);

  const horizontalArticles = useMemo(() => {
    return articles.filter((article) =>
      article.article_special_types?.some(
        (type) => type.name === "horizontal_homepage_article"
      )
    );
  }, [articles]);

  const verticalArticles = useMemo(() => {
    return articles.filter((article) =>
      article.article_special_types?.some(
        (type) => type.name === "vertical_homepage_article"
      )
    );
  }, [articles]);

  return (
    <div className="homepage-container">
      <HomepageHero homepageContent={initialContent} />
      <FavoritePosts homepageArticles={favoriteArticles} />
      <div className="homepage-partners-banner-group">
        <PartnerShowcase partners={initialPartners} />
        <HomepageBanner
          homepageContent={initialContent}
          homepageArticles={bannerArticles}
        />
      </div>
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
