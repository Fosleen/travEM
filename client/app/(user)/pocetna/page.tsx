"use client";

import "./Homepage.scss";
import HomepageHero from "@/components/user/molecules/HomepageHero";
import FavoritePosts from "@/components/user/molecules/FavoritePosts";
import HomepageBanner from "@/components/user/molecules/HomepageBanner";
import OtherPosts from "@/components/user/molecules/OtherPosts";
import BlogStats from "@/components/user/molecules/BlogStats";
import DestinationsMap from "@/components/organisms/DestinationsMap";
import { useContext, useEffect, useState, useMemo } from "react";
import { ArticleContext } from "@/context/ArticleContext";
import RecommendedMapDestinations from "@/components/user/molecules/RecommendedMapDestinations";
import { Article, HomepageData } from "@/common/types";
import { getHomepage } from "@/api/homepage";
import { getHomepageArticles } from "@/api/article";

const Homepage = () => {
  const { homepageArticlesContextData, setHomepageArticlesContextData } =
    useContext(ArticleContext);

  const [homepageContent, setHomepageContent] = useState<HomepageData | null>(
    null
  );

  // Derive filtered articles using useMemo instead of storing in state
  const favoriteArticles = useMemo(() => {
    return (
      homepageArticlesContextData?.filter((article) =>
        article.article_special_types?.some(
          (type) => type.name === "top_homepage_article"
        )
      ) || []
    );
  }, [homepageArticlesContextData]);

  const bannerArticles = useMemo(() => {
    return (
      homepageArticlesContextData?.filter((article) =>
        article.article_special_types?.some(
          (type) => type.name === "banner_homepage_article"
        )
      ) || []
    );
  }, [homepageArticlesContextData]);

  const horizontalArticles = useMemo(() => {
    return (
      homepageArticlesContextData?.filter((article) =>
        article.article_special_types?.some(
          (type) => type.name === "horizontal_homepage_article"
        )
      ) || []
    );
  }, [homepageArticlesContextData]);

  const verticalArticles = useMemo(() => {
    return (
      homepageArticlesContextData?.filter((article) =>
        article.article_special_types?.some(
          (type) => type.name === "vertical_homepage_article"
        )
      ) || []
    );
  }, [homepageArticlesContextData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const content = await getHomepage();
        setHomepageContent(content);

        if (!homepageArticlesContextData) {
          const articles = await getHomepageArticles();
          setHomepageArticlesContextData(articles);
        }
      } catch (error) {
        console.error("Error occurred while fetching homepage data:", error);
      }
    };

    fetchData();
  }, []); // Only run once on mount

  return (
    <div className="homepage-container">
      {homepageContent ? (
        <>
          <meta property="og:title" content="putujEM s travEM" />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={typeof window !== "undefined" ? window.location.href : ""}
          />
          <meta
            property="og:description"
            content="Otkrijte svijet uz Emu i Matiju! Najdetaljniji vodiči, povoljne karte i savjeti za savršeno putovanje."
          />
          <meta property="og:image" content={homepageContent.hero_image_url} />
          <meta property="og:site_name" content="putujEM s travEM" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="putujEM s travEM" />
          <meta
            name="twitter:description"
            content="Otkrijte svijet uz Emu i Matiju! Najdetaljniji vodiči, povoljne karte i savjeti za savršeno putovanje."
          />
          <meta name="twitter:image" content={homepageContent.hero_image_url} />

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
        // <ThreeDots
        //   height="80"
        //   width="80"
        //   radius="8"
        //   color="#2BAC82"
        //   ariaLabel="three-dots-loading"
        //   wrapperStyle={{ justifyContent: "center" }}
        //   visible={true}
        // />
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Homepage;
