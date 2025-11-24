// @ts-nocheck

import "./ArticleFragment.scss";

import { FC } from "react";
import { ArticleProps } from "../../../../common/types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import DOMPurify from "dompurify";

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
          <LazyLoadImage
            alt={section?.section_images[0].url}
            src={section?.section_images[0].url}
          />
        </div>
      )}
      {section?.section_images?.length === 2 && (
        <div className="article-fragment-images-wrapper">
          <LazyLoadImage
            alt={section?.section_images[0].url}
            src={section?.section_images[0].url}
          />
          <LazyLoadImage
            alt={section?.section_images[1].url}
            src={section?.section_images[1].url}
          />
        </div>
      )}

      {article?.video?.url && (
        <div className="article-fragment-video-wrapper">
          <h4>Pogledajte naš video:</h4>
          <iframe src={article.video.url}></iframe>
        </div>
      )}
    </div>
  );
};

export default ArticleFragment;
