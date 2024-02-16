import { FC } from "react";
import FavoritePostItem from "../../atoms/FavoritePostItem";
import "./FavoritePosts.scss";
import { Article } from "../../../../common/types";

const FavoritePosts: FC<{ homepageArticles: Array<Article> }> = ({
  homepageArticles,
}) => {
  return (
    <div className="favorite-posts-container">
      {homepageArticles.map((el) => (
        <>
          <FavoritePostItem article={el} />
        </>
      ))}
    </div>
  );
};

export default FavoritePosts;
