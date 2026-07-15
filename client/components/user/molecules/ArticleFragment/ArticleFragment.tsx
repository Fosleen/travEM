// client/components/user/molecules/ArticleFragment/ArticleFragment.tsx
// @ts-nocheck
import "./ArticleFragment.scss";
import { FC, useMemo, useState } from "react";
import { ArticleProps } from "../../../../common/types";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import VisaInfo from "@/components/user/molecules/VisaInfo/VisaInfo";
import BestTimeToVisit from "@/components/user/molecules/BestTimeToVisit/BestTimeToVisit";
import BestTimeToVisitPlace from "@/components/user/molecules/BestTimeToVisitPlace/BestTimeToVisitPlace";
import CountryLanguage from "@/components/user/molecules/CountryLanguage/CountryLanguage";
import { openLightbox } from "@/utils/lightbox";
import ArticleAffiliateLinks from "@/components/user/molecules/ArticleAffiliateLinks/ArticleAffiliateLinks";

const ArticleFragment: FC<ArticleProps> = ({
  section = {},
  article = {},
  index,
  showVisaInfo = false,
  visaInfoCountryId,
  visaInfoCountryName,
  showBestTimeToVisit = false,
  bestTimeCountryId,
  bestTimeCountrySlug,
  bestTimePlaceId,
  bestTimePlaceNameDative,
  showCountryLanguage = false,
  countryLanguageCountryId,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const sectionId = `odlomak-${index}`;

  const images = section?.section_images || [];
  const hasOne = images?.length === 1;
  const hasTwo = images?.length === 2;

  return (
    <div className="article-wrapper" id={sectionId}>
      <h3>{section?.subtitle}</h3>

      <div
        className="article-html-content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section?.text) }}
      />

      {hasOne && (
        <div className="article-fragment-image-wrapper">
          <Image
            alt={images[0]?.alt || "Article image"}
            src={images[0]?.url?.trim()}
            width={images[0]?.width || 1200}
            height={images[0]?.height || 800}
            sizes="(max-width: 768px) 100vw, (max-width: 1300px) 90vw, 900px"
            className="article-fragment-image"
          />
        </div>
      )}

      {hasTwo && (
        <div className="article-fragment-images-wrapper">
          <div className="article-fragment-image-frame">
            <Image
              alt={images[0]?.alt || "Article image"}
              src={images[0]?.url?.trim()}
              width={images[0]?.width || 1200}
              height={images[0]?.height || 800}
              sizes="(max-width: 768px) 100vw, 450px"
              className="article-fragment-image--cover"
            />
          </div>

          <div className="article-fragment-image-frame">
            <Image
              alt={images[1]?.alt || "Article image"}
              src={images[1]?.url?.trim()}
              width={images[1]?.width || 1200}
              height={images[1]?.height || 800}
              sizes="(max-width: 768px) 100vw, 450px"
              className="article-fragment-image--cover"
            />
          </div>
        </div>
      )}

      {article?.video?.url?.trim() && (
        <div className="article-fragment-video-wrapper">
          <h4>Pogledajte naš video:</h4>
          <iframe
            src={article.video.url.trim()}
            title="Article video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {lightboxSlides.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={lightboxSlides}
          controller={{
            closeOnBackdropClick: true,
          }}
          carousel={{
            finite: !hasMultipleImages,
          }}
          render={{
            buttonPrev: hasMultipleImages ? undefined : () => null,
            buttonNext: hasMultipleImages ? undefined : () => null,
          }}
        />
      )}
    </div>
  );
};

export default ArticleFragment;
