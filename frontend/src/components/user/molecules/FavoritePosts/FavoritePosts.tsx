import FavoritePostItem from "../../atoms/FavoritePostItem";
import "./FavoritePosts.scss";

const FavoritePosts = () => {
  return (
    <div className="favorite-posts-container">
      <FavoritePostItem />
      <FavoritePostItem />
      <FavoritePostItem />
    </div>
  );
};

export default FavoritePosts;
