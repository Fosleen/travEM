import { Link } from "react-router-dom";
import postImage from "../../../../assets/images/post-image.jpg";
import icon from "../../../../assets/images/main-post-icon.png";
import "./MainCountryPost.scss";

const MainCountryPost = () => {
  return (
    <Link to="/" className="main-country-post-container">
      <div className="main-country-post-bg-image-container">
        <img src={postImage} alt="post-bg-image" />
      </div>
      <div className="main-country-top-layer">
        <div className="main-country-post-top-image-container">
          <img src={postImage} alt="post-image" />
        </div>
        <div className="main-country-icon-container">
          <div className="main-country-icon-circle">
            <img src={icon} alt="icon" />
          </div>
        </div>
        <div className="main-country-post-text-container">
          Ultimativni vodič Ciparskim obalama u 7 dana
        </div>
      </div>
    </Link>
  );
};

export default MainCountryPost;
