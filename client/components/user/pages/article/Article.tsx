// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import ArticleFragment from "@/components/user/molecules/ArticleFragment";
import ArticleHero from "@/components/user/molecules/ArticleHero";
import ArticleTableOfContents from "@/components/user/molecules/ArticleTableOfContents";
import "./Article.scss";
import ArticleReadMore from "@/components/user/atoms/ArticleReadMore";
import CountryPlaces from "@/components/user/molecules/CountryPlaces";
import React, { useMemo, useState } from "react";
import RecommendedPosts from "@/components/user/molecules/RecommendedPosts";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import ArticleTableOfContentsDropUp from "@/components/user/molecules/ArticleTableOfContentsDropUp/ArticleTableOfContentsDropUp";
import ArticleNewsletterCallToAction from "@/components/user/molecules/ArticleNewsletterCallToAction/ArticleNewsletterCallToAction";
import ArticleSupportCallToAction from "@/components/user/molecules/ArticleSupportCallToAction/ArticleSupportCallToAction";
import { parseBooleanValue } from "@/utils/parseBooleanValue";
import { openLightbox } from "@/utils/lightbox";

interface ArticleProps {
  initialArticle: any;
  initialCountryPlaces: any[];
}

const getNewsletterInsertIndex = (sectionsLength: number) => {
  if (sectionsLength <= 0) return -1;
  if (sectionsLength <= 4) return 1;
  if (sectionsLength <= 7) return 2;
  return 3;
};

const getSupportInsertIndex = (sectionsLength: number) => {
  if (sectionsLength < 15) return -1;

  return Math.floor(sectionsLength * 0.65);
};

const Article = ({ initialArticle, initialCountryPlaces }: ArticleProps) => {
  const router = useRouter();
  const articleContent = initialArticle;
  const countryPlaces = initialCountryPlaces;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const sectionsLength = articleContent?.sections?.length || 0;

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

  const newsletterInsertIndex = useMemo(() => {
    return getNewsletterInsertIndex(sectionsLength);
  }, [sectionsLength]);

  const supportInsertIndex = useMemo(() => {
    return getSupportInsertIndex(sectionsLength);
  }, [sectionsLength]);

  const shouldShowBottomNewsletter = sectionsLength >= 10;
  const shouldShowInlineSupport = supportInsertIndex !== -1;
  const shouldShowBottomSupport = sectionsLength >= 3;

  const shouldShowSectionVisaInfo = (section: any) => {
    const hasEnabledVisaInfo =
      parseBooleanValue(section?.show_visa_info) ||
      parseBooleanValue(section?.showVisaInfo);

    return (
      hasEnabledVisaInfo &&
      articleContent?.country?.id &&
      articleContent?.country?.name
    );
  };

  const shouldShowSectionBestTimeToVisit = (section: any) => {
    const hasEnabledBestTime =
      parseBooleanValue(section?.show_best_time_to_visit) ||
      parseBooleanValue(section?.showBestTimeToVisit);

    return (
      hasEnabledBestTime &&
      articleContent?.country?.id &&
      articleContent?.country?.name
    );
  };

  const shouldShowSectionCountryLanguage = (section: any) => {
    const hasEnabledCountryLanguage =
      parseBooleanValue(section?.show_country_language) ||
      parseBooleanValue(section?.showCountryLanguage);

    return hasEnabledCountryLanguage && articleContent?.country?.id;
  };

  const getArticlePlaceId = () => {
    return articleContent?.place?.id || articleContent?.placeId || null;
  };

  const getArticlePlaceNameDative = () => {
    return (
      articleContent?.place?.name_dative ||
      articleContent?.place?.nameDative ||
      articleContent?.place?.name ||
      ""
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
              <img
                src="/images/location.png"
                alt="location"
                width={20}
                height={24}
              />
              <h4 onClick={handlePlaceClick} className="article-location-text">
                {articleContent.place && `${articleContent.place.name}, `}
              </h4>
              <h4 onClick={handleCountryClick} className="article-location-text">
                {articleContent.country.name}
              </h4>
            </div>
          )}
        </div>
      </div>

      <ArticleTableOfContents article={articleContent} key={articleContent.id} />

      <div className="toc-dropup-sentinel" />

      <ArticleTableOfContentsDropUp article={articleContent} />

      <div className="article-content">
        {articleContent?.sections?.map((section, index) => (
          <React.Fragment key={index}>
            <ArticleFragment
              section={section}
              index={index}
              showVisaInfo={shouldShowSectionVisaInfo(section)}
              visaInfoCountryId={articleContent?.country?.id}
              visaInfoCountryName={articleContent?.country?.name}
              showBestTimeToVisit={shouldShowSectionBestTimeToVisit(section)}
              bestTimeCountryId={articleContent?.country?.id}
              bestTimeCountrySlug={articleContent?.country?.name || ""}
              bestTimePlaceId={getArticlePlaceId()}
              bestTimePlaceNameDative={getArticlePlaceNameDative()}
              showCountryLanguage={shouldShowSectionCountryLanguage(section)}
              countryLanguageCountryId={articleContent?.country?.id}
            />

            {section.link_title !== "" && <ArticleReadMore section={section} />}

            {index === newsletterInsertIndex && (
              <ArticleNewsletterCallToAction />
            )}

            {shouldShowInlineSupport && index === supportInsertIndex && (
              <ArticleSupportCallToAction />
            )}
          </React.Fragment>
        ))}

        {shouldShowBottomNewsletter && <ArticleNewsletterCallToAction />}

        {shouldShowBottomSupport && <ArticleSupportCallToAction />}

        <ArticleFragment article={articleContent} />
      </div>

      <div className="article-gallery-text-wrapper">
        {galleryImages?.length > 0 && <h3>Slika govori 1000 riječi</h3>}

        {articleContent.articleTypeId === 1 && (
          <div className="article-location-container">
            <div className="article-location">
              <img
                src="/images/location.png"
                alt="location"
                width={20}
                height={24}
              />
              <h4 onClick={handlePlaceClick} className="article-location-text">
                {articleContent.place && `${articleContent.place.name}, `}
              </h4>
              <h4 onClick={handleCountryClick} className="article-location-text">
                {articleContent.country.name}
              </h4>
            </div>
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
                onClick={() =>
                  openLightbox({
                    index,
                    setLightboxIndex,
                    setLightboxOpen,
                  })
                }
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