import "./ArticleFragment.scss";

import { FC, useEffect } from "react";
import { ArticleProps } from "../../../../common/types";

const ArticleFragment: FC<ArticleProps> = ({ section = {}, article = {} }) => {
  useEffect(() => {
    console.log("Ja dobijem sekciju", section);
    console.log("Count je", section?.section_images?.length);
    console.log("Dobijem ovaj article", article);
  });
  return (
    <div className="article-wrapper">
      <h3>{section?.subtitle}</h3>
      <p>{section?.text}</p>
      {section?.section_images?.length === 1 && (
        <div className="article-fragment-image-wrapper">
          {" "}
          <img src={section?.section_images[0].url} alt="" />
        </div>
      )}
      {section?.section_images?.length === 2 && (
        <div className="article-fragment-images-wrapper">
          <img src={section?.section_images[0].url} alt="" />
          <img src={section?.section_images[1].url} alt="" />
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
