// client/components/user/molecules/ArticleFragment/ArticleFragment.tsx
// @ts-nocheck
import "./ArticleFragment.scss";
import { FC, useMemo, useState } from "react";
import { ArticleProps } from "../../../../common/types";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";

const ArticleFragment: FC<ArticleProps> = ({
  section = {},
  article = {},
  index,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const sectionId = `odlomak-${index}`;

  const images = useMemo(
    () => (section?.section_images || []).filter((image) => image?.url?.trim?.()),
    [section?.section_images]
  );

  const hasOne = images.length === 1;
  const hasTwo = images.length === 2;
  const hasMultipleImages = images.length > 1;

  const iconUrl = section?.section_icon?.url?.trim?.() || "";
  const hasIcon = Boolean(iconUrl);

  const title = (section?.subtitle || "").trim();
  const hasTitle = title.length > 0;

  const hasHtmlContent =
    typeof section?.text === "string" &&
    section.text.replace(/<[^>]*>/g, "").trim().length > 0;

  const hasVideo = Boolean(article?.video?.url?.trim());

  const hasAnything = hasTitle || hasHtmlContent || hasOne || hasTwo || hasVideo;
  if (!hasAnything) return null;

  const lightboxSlides = images.map((image) => ({
    src: image.url.trim(),
    alt: image.alt || "Article image",
  }));

  const openLightbox = (clickedIndex: number) => {
    setLightboxIndex(clickedIndex);
    setLightboxOpen(true);
  };

  return (
    <div className="article-wrapper" id={sectionId}>
      {hasTitle &&
        (hasIcon ? (
          <div className="article-section-title article-section-title--with-icon">
            <div className="article-section-title__icon" aria-hidden="true">
              <img src={iconUrl} alt="" />
            </div>
            <h2 className="article-section-title__text">{title}</h2>
          </div>
        ) : (
          <h3 className="article-section-title article-section-title--default">
            {title}
          </h3>
        ))}

      {hasHtmlContent && (
        <div
          className="article-html-content"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section?.text) }}
        />
      )}

      {hasOne && (
        <div className="article-fragment-image-wrapper">
          <div
            className="article-fragment-image-clickable"
            onClick={() => openLightbox(0)}
          >
            <Image
              alt={images[0]?.alt || "Article image"}
              src={images[0]?.url?.trim()}
              width={images[0]?.width || 1200}
              height={images[0]?.height || 800}
              sizes="(max-width: 768px) 100vw, (max-width: 1300px) 90vw, 900px"
              className="article-fragment-image"
            />
          </div>
        </div>
      )}

      {hasTwo && (
        <div className="article-fragment-images-wrapper">
          <div
            className="article-fragment-image-frame article-fragment-image-frame--clickable"
            onClick={() => openLightbox(0)}
          >
            <Image
              alt={images[0]?.alt || "Article image"}
              src={images[0]?.url?.trim()}
              width={images[0]?.width || 1200}
              height={images[0]?.height || 800}
              sizes="(max-width: 768px) 100vw, 450px"
              className="article-fragment-image--cover"
            />
          </div>

          <div
            className="article-fragment-image-frame article-fragment-image-frame--clickable"
            onClick={() => openLightbox(1)}
          >
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

      {hasVideo && (
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