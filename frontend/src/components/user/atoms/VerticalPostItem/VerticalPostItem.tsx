import "./VerticalPostItem.scss";
import postImage from "../../../../assets/images/post-image.jpg";

const VerticalPostItem = () => {
  return (
    <div className="vertical-post-item-container">
      <div className="vertical-post-item-text-container">
        <p className="text-title">Cipar</p>
        <p className="text-description">
          otok podjele ali ne znam kaj oon da i ja{" "}
        </p>
      </div>
      <div className="vertical-post-item-image-container">
        <img src={postImage} alt="post-image" />
      </div>
    </div>
  );
};

export default VerticalPostItem;
