// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import ArticleFragment from "@/components/user/molecules/ArticleFragment";
import ArticleHero from "@/components/user/molecules/ArticleHero";
import ArticleTableOfContents from "@/components/user/molecules/ArticleTableOfContents";
import "./Article.scss";
import ArticleReadMore from "@/components/user/atoms/ArticleReadMore";
import CountryPlaces from "@/components/user/molecules/CountryPlaces";
import React, { useState } from "react";
import RecommendedPosts from "@/components/user/molecules/RecommendedPosts";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ArticleProps {
  initialArticle: any;
  initialCountryPlaces: any[];
}

const Article = ({ initialArticle, initialCountryPlaces }: ArticleProps) => {
  const router = useRouter();
  const articleContent = initialArticle;
  const countryPlaces = initialCountryPlaces;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleCountryClick = () => {
    router.push(`/destinacija/${articleContent.country.name.toLowerCase()}`);
  };

  const handlePlaceClick = () => {
    router.push(
      `/destinacija/${articleContent.country.name.toLowerCase()}/${articleContent.place.name.toLowerCase()}`
    );
  };

  const galleryImages = articleContent?.gallery_images?.filter(
    (image) => image.url
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
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
              <Image
                src="/images/location.png"
                alt="location"
                width={20}
                height={24}
              />
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
        {galleryImages?.length > 0 && <h3>Slika govori 1000 riječi</h3>}

        {articleContent.articleTypeId === 1 && (
          <div className="article-location-container">
            <Image
              src="/images/location.png"
              alt="location"
              width={24}
              height={24}
            />
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
        {galleryImages?.length > 0 && (
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div
                key={image.id || index}
                className="gallery-item"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.url.trim()}
                  alt={image.alt || "Gallery image"}
                  width={image.width || 600}
                  height={image.height || 400}
                  quality={90}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={galleryImages?.map((image) => ({
            src: image.url.trim(),
            alt: image.alt || "Gallery image",
          }))}
        />
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
