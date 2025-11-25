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
  return (
    <div className="article-wrapper" id={sectionId}>
      <h3>{section?.subtitle}</h3>
      <div
        className="article-html-content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section?.text) }}
      />
      {section?.section_images?.length === 1 && (
        <div className="article-fragment-image-wrapper">
          <Image
            alt={section?.section_images[0].alt || "Article image"}
            src={section?.section_images[0].url.trim()}
            width={section?.section_images[0].width || 1200}
            height={section?.section_images[0].height || 800}
            sizes="(max-width: 768px) 100vw, (max-width: 1300px) 90vw, 1200px"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}
      {section?.section_images?.length === 2 && (
        <div className="article-fragment-images-wrapper">
          <Image
            alt={section?.section_images[0].alt || "Article image"}
            src={section?.section_images[0].url.trim()}
            width={section?.section_images[0].width || 600}
            height={section?.section_images[0].height || 400}
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ width: "100%", height: "auto" }}
          />
          <Image
            alt={section?.section_images[1].alt || "Article image"}
            src={section?.section_images[1].url.trim()}
            width={section?.section_images[1].width || 600}
            height={section?.section_images[1].height || 400}
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}
      {article?.video?.url.trim() && (
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
