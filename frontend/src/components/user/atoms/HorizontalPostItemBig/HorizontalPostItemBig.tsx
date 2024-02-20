// @ts-nocheck

import { FC, useEffect } from "react";
import "./HorizontalPostItemBig.scss";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../utils/global";
import { HorizontalPostItemBigProps } from "../../../../common/types";

const HorizontalPostItemBig: FC<HorizontalPostItemBigProps> = ({
  stretched,
  thin,
  hasDate = true,
  type = "article",
  article,
}) => {
  useEffect(() => {
    console.log("Predlozeni article je", article);
  });
  return (
    <Link
      to={
        type == "article"
          ? `/clanak/${article.id}`
          : `/destinacija/${article.name}`
      }
    >
      <div
        className={`horizontal-post-item-big-container ${
          stretched ? "stretched" : ""
        }${thin ? "thin" : ""}`}
      >
        <div className="horizontal-post-item-big-image-container">
          <img src={article.main_image_url} alt="post-image" />
        </div>
        <div className="horizontal-post-item-big-text-container">
          <h4>{type == "article" ? article.title : article.name}</h4>
          <div className="horizontal-post-item-big-inner-text-container">
            <p>{article.subtitle} </p>
            {!stretched && hasDate && article.date_written && (
              <p>{formatDate(article.date_written)}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalPostItemBig;
