import { FC } from "react";
import "./HorizontalPostItemBig.scss";
import postImage from "../../../assets/images/post-image.jpg";
import { Link } from "react-router-dom";

interface HorizontalPostItemBigProps {
  stretched?: boolean;
}

const HorizontalPostItemBig: FC<HorizontalPostItemBigProps> = ({
  stretched,
}) => {
  return (
    <Link to="/">
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
            <p>Ovo morate znati prije </p>
            {!stretched && <p>5.5.2025.</p>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalPostItemBig;
