import postImage from "../../../assets/images/post-image.jpg";
import "./HorizontalPostItem.scss";

const HorizontalPostItem = ({ isSmall }) => {
  return (
    <div className={`horizontal-post-item-container ${isSmall && "small"}`}>
      <div
        className={`horizontal-post-item-image-container ${isSmall && "small"}`}
      >
        <img src={postImage} alt="post-image" />
      </div>
      <div className="horizontal-post-item-text-container">
        <p className={`${isSmall && "small"}`}>
          Ciparske avanture s morskim psima za đ
        </p>
      </div>
    </div>
  );
};

export default HorizontalPostItem;
