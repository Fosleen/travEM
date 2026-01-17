// client/components/user/molecules/ArticleFragment/ArticleFragment.tsx
// @ts-nocheck
import "./ArticleFragment.scss";
import { FC } from "react";
import { ArticleProps } from "../../../../common/types";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";

const ArticleFragment: FC<ArticleProps> = ({
  section = {},
  article = {},
  index,
}) => {
  const sectionId = `odlomak-${index}`;

  const images = section?.section_images || [];
  const hasOne = images?.length === 1;
  const hasTwo = images?.length === 2;

  const iconUrl = section?.section_icon?.url?.trim?.() || "";
  const hasIcon = Boolean(iconUrl);

  const title = (section?.subtitle || "").trim();
  const hasTitle = title.length > 0;

  const hasHtmlContent =
    typeof section?.text === "string" &&
    section.text.replace(/<[^>]*>/g, "").trim().length > 0;

  const hasVideo = Boolean(article?.video?.url?.trim());

  // Ako u sekciji stvarno nema ništa, nemoj renderati wrapper (da nema praznog gap-a između fragmenata)
  const hasAnything = hasTitle || hasHtmlContent || hasOne || hasTwo || hasVideo;
  if (!hasAnything) return null;

  return (
    <div className="article-wrapper" id={sectionId}>
      {/* Title (H2 ako ima ikonu, inače H3) */}
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
    </div>
  );
};

export default ArticleFragment;
