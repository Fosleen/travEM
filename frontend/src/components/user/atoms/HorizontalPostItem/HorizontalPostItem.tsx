import { Link } from "react-router-dom";
import "./HorizontalPostItem.scss";
import { FC } from "react";
import { Article } from "../../../../common/types";

const HorizontalPostItem: FC<{ isSmall?: boolean; article: Article }> = ({
  isSmall = false,
  article,
}) => {
  return (
    <>
      {article && (
        <Link
          to="/"
          className={`horizontal-post-item-container ${isSmall && "small"}`}
        >
          <div
            className={`horizontal-post-item-image-container ${
              isSmall && "small"
            }`}
          >
            <img src={article.main_image_url} alt="post-image" />
          </div>
          <div className="horizontal-post-item-text-container">
            <p className={`${isSmall && "small"}`}>{article.title}</p>
          </div>
        </Link>
      )}
    </>
  );
};

export default HorizontalPostItem;
