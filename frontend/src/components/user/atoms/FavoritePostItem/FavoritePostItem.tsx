import { Link } from "react-router-dom";
import "./FavoritePostItem.scss";
import { FC } from "react";
import { Article } from "../../../../common/types";

const FavoritePostItem: FC<{ article: Article }> = ({ article }) => {
  return (
    <>
      {article && (
        <Link
          to={`/clanak/${article.id}`}
          className="favorite-post-item-container"
        >
          {article.country && article.country.flag_image_url && (
            <div className="favorite-post-item-icon-container">
              <img
                className="favorite-post-item-icon"
                src={article.country.flag_image_url}
                alt="map-image"
              />
            </div>
          )}
          <div className="favorite-post-item-content">
            <div className="favorite-post-item-content-text">
              <p>{article.title}</p>
            </div>
            <div className="favorite-post-item-content-image">
              <img src={article.main_image_url} alt="post-image" />
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default FavoritePostItem;
