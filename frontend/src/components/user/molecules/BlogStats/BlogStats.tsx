import "./BlogStats.scss";
import icon1 from "../../../../assets/images/world-icon.png";
import icon2 from "../../../../assets/images/globe-icon.png";
import icon3 from "../../../../assets/images/article-icon.png";
import icon4 from "../../../../assets/images/plane-ticket-icon.png";
import icon5 from "../../../../assets/images/vlogging-icon.png";
import icon6 from "../../../../assets/images/walk-icon.png";
import BlogStatsItem from "../../atoms/BlogStatsItem";

const BlogStats = () => {
  return (
    <div className="blog-stats-container">
      <BlogStatsItem icon={icon1} />
      <BlogStatsItem icon={icon2} />
      <BlogStatsItem icon={icon3} />
      <BlogStatsItem icon={icon4} />
      <BlogStatsItem icon={icon5} />
      <BlogStatsItem icon={icon6} />
    </div>
  );
};

export default BlogStats;
