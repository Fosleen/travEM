import "./VerticalPostItem.scss";
import postImage from "../../../../assets/images/post-image.jpg";
import { Link } from "react-router-dom";

const VerticalPostItem = () => {
  return (
    <Link to="/" className="vertical-post-item-container">
      <div className="vertical-post-item-text-container">
        <p className="text-title">Cipar</p>
        <p className="text-description">
          otok podjele ali ne znam kaj oon da i ja
        </p>
      </div>
      <div className="vertical-post-item-image-container">
        <div className="overlay"></div>
        <img src={postImage} alt="post-image" />
      </div>
    </Link>
  );
};

export default VerticalPostItem;
