import postImage from "../../../assets/images/post-image.jpg";
import mapImage from "../../../assets/images/spain-map.png";

import "./FavoritePostItem.scss";

const FavoritePostItem = () => {
  return (
    <div className="favorite-post-item-container">
      <div className="favorite-post-item-icon-container">
        <img
          className="favorite-post-item-icon"
          src={mapImage}
          alt="map-image"
        />
      </div>
      <div className="favorite-post-item-content">
        <div className="favorite-post-item-content-text">
          <p>Top 15 stvari koje morate vidjeti na Tenerifima</p>
        </div>
        <div className="favorite-post-item-content-image">
          <img src={postImage} alt="post-image" />
        </div>
      </div>
    </div>
  );
};

export default FavoritePostItem;
