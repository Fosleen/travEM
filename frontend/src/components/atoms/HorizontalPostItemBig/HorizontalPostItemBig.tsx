import "./HorizontalPostItemBig.scss";
import postImage from "../../../assets/post-image.jpg";

const HorizontalPostItemBig = () => {
  return (
    <div className="horizontal-post-item-big-wrapper">
      <div className="horizontal-post-item-big-image-wrapper">
        <img src={postImage} alt="" />
      </div>
      <div className="horizontal-post-item-big-text-wrapper">
        <h2>Akcija na letove prema Africi</h2>
        <h4>Ovo morate znati prije slijedećeg putovanja</h4>
        <h4>5.5.2025.</h4>
      </div>
    </div>
  );
};

export default HorizontalPostItemBig;
