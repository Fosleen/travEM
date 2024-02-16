// @ts-nocheck

import "./RecommendedPosts.scss";
import HorizontalPostItemBig from "../../atoms/HorizontalPostItemBig";

const RecommendedPosts = () => {
  return (
    <div className="recommended-posts-container">
      <h2>Povezani članci</h2>
      <div className="recommended-posts last">
        <HorizontalPostItemBig thin hasDate={false} />
        <HorizontalPostItemBig thin hasDate={false} />
        <HorizontalPostItemBig thin hasDate={false} />
        <HorizontalPostItemBig thin hasDate={false} />
      </div>
    </div>
  );
};

export default RecommendedPosts;
