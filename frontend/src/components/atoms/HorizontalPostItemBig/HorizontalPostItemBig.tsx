import { FC } from "react";
import "./HorizontalPostItemBig.scss";
import postImage from "../../../assets/post-image.jpg";

interface HorizontalPostItemBigProps {
  stretched?: boolean;
}

const HorizontalPostItemBig: FC<HorizontalPostItemBigProps> = ({
  stretched,
}) => {
  return (
    <div
      className={`horizontal-post-item-big-container ${
        stretched ? "stretched" : ""
      }`}
    >
      <div className="horizontal-post-item-big-image-container">
        <img src={postImage} alt="post-image" />
      </div>
      <div className="horizontal-post-item-big-text-container">
        <h4>Kako ja letim za 5E</h4>
        <div className="horizontal-post-item-big-inner-text-container">
          <p>Ovo morate znati prije slijedećeg putovanja</p>
          {!stretched && <p>5.5.2025.</p>}
        </div>
      </div>
    </div>
  );
};

export default HorizontalPostItemBig;
