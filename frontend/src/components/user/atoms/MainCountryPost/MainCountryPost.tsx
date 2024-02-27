// @ts-nocheck

import { Link } from "react-router-dom";
import icon from "../../../../assets/images/main-post-icon.png";
import "./MainCountryPost.scss";

const MainCountryPost = ({ article }) => {
  return (
    <Link to={`/clanak/${article.id}`} className="main-country-post-container">
      <div className="main-country-post-bg-image-container">
        <img src={article.main_image_url} alt="post-bg-image" />
      </div>
      <div className="main-country-top-layer">
        <div className="main-country-post-top-image-container">
          <img src={article.main_image_url} alt="post-image" />
        </div>
        <div className="main-country-icon-container">
          <div className="main-country-icon-circle">
            <img src={icon} alt="icon" />
          </div>
        </div>
        <div className="main-country-post-text-container">{article.title}</div>
      </div>
    </Link>
  );
};

export default MainCountryPost;
