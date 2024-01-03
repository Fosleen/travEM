import { Link } from "react-router-dom";
import postImage from "../../../../assets/images/post-image.jpg";
import "./HorizontalPostItem.scss";

const HorizontalPostItem = ({ isSmall = false }) => {
  return (
    <Link
      to="/"
      className={`horizontal-post-item-container ${isSmall && "small"}`}
    >
      <div
        className={`horizontal-post-item-image-container ${isSmall && "small"}`}
      >
        <img src={postImage} alt="post-image" />
      </div>
      <div className="horizontal-post-item-text-container">
        <p className={`${isSmall && "small"}`}>
          Ciparske avanture s morskim psima za đ Ciparske avanture Ciparske avanture 
        </p>
      </div>
    </Link>
  );
};

export default HorizontalPostItem;
