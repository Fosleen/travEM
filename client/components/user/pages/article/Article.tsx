"use client";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import ArticleFragment from "@/components/user/molecules/ArticleFragment";
import ArticleHero from "@/components/user/molecules/ArticleHero";
import ArticleTableOfContents from "@/components/user/molecules/ArticleTableOfContents";
import "./Article.scss";
import Gallery from "react-photo-gallery";
import ArticleReadMore from "@/components/user/atoms/ArticleReadMore";
import Location from "@/assets/images/location.png";
import CountryPlaces from "@/components/user/molecules/CountryPlaces";
import React from "react";
import RecommendedPosts from "@/components/user/molecules/RecommendedPosts";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ArticleProps {
  initialArticle: any;
  initialCountryPlaces: any[];
}

const Article = ({ initialArticle, initialCountryPlaces }: ArticleProps) => {
  const router = useRouter();
  const articleContent = initialArticle;
  const countryPlaces = initialCountryPlaces;

  const handleCountryClick = () => {
    router.push(`/destinacija/${articleContent.country.name.toLowerCase()}`);
  };

  const handlePlaceClick = () => {
    router.push(
      `/destinacija/${articleContent.country.name.toLowerCase()}/${articleContent.place.name.toLowerCase()}`
    );
  };

  return (
    <div>
      <div className="article-container">
        <ArticleHero article={articleContent} />
      </div>
      <div className="article-location-parent">
        <div className="article-location-container">
          {articleContent.articleTypeId === 1 && (
            <div className="article-location">
              <Image src={Location} alt="location" width={24} height={24} />
              <h4 onClick={handlePlaceClick} className="article-location">
                {articleContent.place && `${articleContent.place.name}, `}
              </h4>
              <h4 onClick={handleCountryClick} className="article-location">
                {articleContent.country.name}
              </h4>
            </div>
          )}
        </div>
      </div>
      <ArticleTableOfContents
        article={articleContent}
        key={articleContent.id}
      />
      <div className="article-content">
        {articleContent?.sections?.map((section, index) => (
          <React.Fragment key={index}>
            <ArticleFragment section={section} index={index} />
            {section.link_title !== "" && <ArticleReadMore section={section} />}
          </React.Fragment>
        ))}
        <ArticleFragment article={articleContent} />
      </div>

      <div className="article-gallery-text-wrapper">
        {articleContent?.gallery_images?.length > 0 && (
          <h3>Slika govori 1000 riječi</h3>
        )}

        {articleContent.articleTypeId === 1 && (
          <div className="article-location-container">
            <Image src={Location} alt="location" width={24} height={24} />
            <h4 onClick={handlePlaceClick} className="article-location">
              {articleContent.place && `${articleContent.place.name}, `}
            </h4>
            <h4 onClick={handleCountryClick} className="article-location">
              {articleContent.country.name}
            </h4>
          </div>
        )}
      </div>

      <div className="article-gallery-wrapper">
        {articleContent?.gallery_images && (
          <Gallery
            photos={articleContent.gallery_images.map((image) => ({
              src: image.url,
              width: image.width,
              height: image.height,
            }))}
          />
        )}
      </div>

      {countryPlaces.length !== 0 && (
        <CountryPlaces hasPadding={false} places={countryPlaces} />
      )}
      <div className="article-connected-articles-wrapper">
        <RecommendedPosts
          id={articleContent.id}
          type={articleContent.articleTypeId}
        />
      </div>
    </div>
  );
};

export default Article;
