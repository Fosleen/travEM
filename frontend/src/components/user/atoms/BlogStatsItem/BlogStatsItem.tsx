import { BlogStatsItemProps } from "../../../../common/types";
import "./BlogStatsItem.scss";
import { FC } from "react";

const BlogStatsItem: FC<BlogStatsItemProps> = ({ icon, value }) => {
  return (
    <div className="blog-stats-item-container">
      <div className="blog-stats-item-wrapper">
        <div className="blog-stats-item-image">
          <img src={icon} alt="icon" />
        </div>
        <div className="blog-stats-item-value">
          <p>{value ? value : "0"}</p>
        </div>
      </div>
      <p>prijeđenih kilometara</p>
    </div>
  );
};

export default BlogStatsItem;
