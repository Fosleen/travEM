import "./BlogStats.scss";
import icon1 from "../../../../assets/images/world-icon.png";
import icon2 from "../../../../assets/images/globe-icon.png";
import icon3 from "../../../../assets/images/article-icon.png";
import icon4 from "../../../../assets/images/plane-ticket-icon.png";
import icon5 from "../../../../assets/images/vlogging-icon.png";
import icon6 from "../../../../assets/images/walk-icon.png";
import BlogStatsItem from "../../atoms/BlogStatsItem";
import { HomepageData } from "../../../../common/types";
import { FC } from "react";

const BlogStats: FC<{ homepageContent: HomepageData }> = ({
  homepageContent,
}) => {
  return (
    <div className="blog-stats-container">
      <BlogStatsItem icon={icon1} />
      <BlogStatsItem icon={icon2} />
      <BlogStatsItem icon={icon3} />
      <BlogStatsItem icon={icon4} value={homepageContent.flights_nmbr} />
      <BlogStatsItem icon={icon5} value={homepageContent.videos_nmbr} />
      <BlogStatsItem icon={icon6} value={homepageContent.distance_nmbr} />
    </div>
  );
};

export default BlogStats;
