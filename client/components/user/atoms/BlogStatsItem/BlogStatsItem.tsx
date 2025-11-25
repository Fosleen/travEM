import { BlogStatsItemProps } from "../../../../common/types";
import "./BlogStatsItem.scss";
import { FC } from "react";
import Image from "next/image";

const BlogStatsItem: FC<BlogStatsItemProps> = ({ icon, value, text }) => {
  return (
    <div className="blog-stats-item-container">
      <div className="blog-stats-item-wrapper">
        <div className="blog-stats-item-image">
          <Image
            src={icon}
            alt="icon"
            width={135}
            height={135}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
        <div className="blog-stats-item-value">
          <p>{value}</p>
        </div>
      </div>
      <p>{text}</p>
    </div>
  );
};

export default BlogStatsItem;
